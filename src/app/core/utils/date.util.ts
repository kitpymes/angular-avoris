type DateLocale = 'es' | 'gb';

type MaskDay = '' | 'd' | 'dd' | 'ddd' | 'ddd';
type MaskMonth = '' | 'm' | 'mm' | 'mmm' | 'mmmm';
type MaskYear = '' | 'yy' | 'yyyy';
type MaskSeparator = '' | ' ' | '/' | '-' | ',';

export type DateMaskCustom = {
	day: MaskDay,
	separatorDayAndMonth: MaskSeparator,
	month: MaskMonth,
	separatorMonthAndYear: MaskSeparator,
	year: MaskYear
};

type DateMask =
	'dmyyyy' | 'mdyyyyy' | 'yyyymd' |
	'm/d/yy' | 'm-d-yy' | 'mmm/d/yyyy' | 'mmm-d-yyyy' | 'mmmm/d/yy' | 'mmmm-d-yy' | 'mmmm d, yyyy' |
	'd/m/yy' | 'd-m-yy' | 'd/mmm/yyyy' | 'd-mmm-yyyy' | 'd/mmmm/yy' | 'd-mmmm-yy' | 'd mmmm, yyyy' |
	'yyyy/mm/dd' | 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'dd-mm-yyyy' | 'yyyymmdd' |
	'ddd mmm dd yyyy HH:MM:ss' |
	'dddd, mmmm d, yyyy' | 'dd/mm/yyyy HH:mm:ss' |
	'h:MM TT' |
	'h:MM:ss TT' |
	'h:MM:ss TT Z' |
	'HH:MM:ss' |
	'd/m/yyyy h:m:s' |
	'yyyy-mm-dd\'T\'HH:MM:sso' |
	'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'' |
	'ddd, dd mmm yyyy HH:MM:ss Z';

export const dateFormat = (mask: DateMask | DateMaskCustom, date: Date = new Date()) => {
	const regexToken = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
	const regexTimezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	const regexTimezoneClip = /[^-+\dA-Z]/g;

	var maskSlice = mask.toString().slice(0, 4);
	const utc = maskSlice === 'UTC:';
	const gmt = maskSlice === 'GMT:';
	const prefixUtc = utc ? "getUTC" : "get";

	const d = (<any>date)[`${prefixUtc}Date`](),
		D = (<any>date)[`${prefixUtc}Day`](),
		m = (<any>date)[`${prefixUtc}Month`](),
		y = (<any>date)[`${prefixUtc}FullYear`](),
		H = (<any>date)[`${prefixUtc}Hours`](),
		M = (<any>date)[`${prefixUtc}Minutes`](),
		s = (<any>date)[`${prefixUtc}Seconds`](),
		L = (<any>date)[`${prefixUtc}Milliseconds`](),
		o = utc ? 0 : date.getTimezoneOffset(),
		W = getWeek(date),
		N = getDay(date);

	const i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		],
		timeNames: [
			'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
		]
	};

	const pad = (val: any, len?: any) => {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = '0' + val;
		}

		return val;
	};

	const flags: any = {
		d: d,
		dd: pad(d),
		ddd: i18n.dayNames[D],
		dddd: i18n.dayNames[D + 7],
		m: m + 1,
		mm: pad(m + 1),
		mmm: i18n.monthNames[m],
		mmmm: i18n.monthNames[m + 12],
		yy: String(y).slice(2),
		yyyy: y,
		h: H % 12 || 12,
		hh: pad(H % 12 || 12),
		H: H,
		HH: pad(H),
		M: M,
		MM: pad(M),
		s: s,
		ss: pad(s),
		l: pad(L, 3),
		L: pad(Math.round(L / 10)),
		t: H < 12 ? i18n.timeNames[0] : i18n.timeNames[1],
		tt: H < 12 ? i18n.timeNames[2] : i18n.timeNames[3],
		T: H < 12 ? i18n.timeNames[4] : i18n.timeNames[5],
		TT: H < 12 ? i18n.timeNames[6] : i18n.timeNames[7],
		Z: gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(regexTimezone) || ['']).pop()?.replace(regexTimezoneClip, ''),
		o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
		S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : +(d % 100 - d % 10 != 10) * d % 10],
		W: W,
		N: N
	};

	return mask.toString().replace(regexToken, (match) => match in flags ? flags[match] : match.slice(1, match.length - 1));
}

const getWeek = (date: Date) => {
	// Remove time components of date
	const targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	// Change date to Thursday same week
	targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

	// Take January 4th as it is always in week 1 (see ISO 8601)
	const firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

	// Change date to Thursday same week
	firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

	// Check if daylight-saving-time-switch occurred and correct for it
	const ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
	targetThursday.setHours(targetThursday.getHours() - ds);

	// Number of weeks between target Thursday and first Thursday
	const weekDiff = (targetThursday.getTime() - firstThursday.getTime()) / (86400000 * 7);
	return 1 + Math.floor(weekDiff);
}


/**
* Obtiene el número del día de la fecha.
* @param date fecha
* @returns el día de la fecha
*/
export const getDay = (date: Date): number => {
	const dayNumber = date.getDay();
	return dayNumber === 0 ? 7 : dayNumber;
}

/**
* Obtiene una fecha sumandole o restandole días.
* @param days número de días
* @returns la fecha correspondiente
*/
export const getDateByDays = (days: number): Date => {
	const date = new Date();
	date.setDate(date.getDate() + (days));

	return date;
}

/**
* Agrega años a una fecha actual.
* @param years número de años
* @returns la fecha con los años solicitados
*/
export const addYearsCurrentDate = (years: number): Date => addYears(new Date(), years);

/**
* Agrega años a una fecha pasada por parámetro.
* @param date fecha
* @param years número de años
* @returns la fecha con los años solicitados
*/
export const addYears = (date: Date, years: number): Date => new Date(date.setFullYear(date.getFullYear() + years));

export const dateString = (date = new Date(), locales = <Intl.LocalesArgument>'es', format = <Intl.DateTimeFormatOptions>{
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit"
}) => date.toLocaleDateString(locales, format);
