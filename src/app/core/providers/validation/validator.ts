const Settings = <{ [key: string]: { langKey: string, regExp?: RegExp } }>{
	default: {
		langKey: 'APP.VALIDATIONS.FIELD_INVALID',
	},
	required: {
		langKey: 'APP.VALIDATIONS.FIELD_REQUIRED',
	},
	email: {
		langKey: 'APP.VALIDATIONS.FIELD_INVALID',
		regExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
	},
	name: {
		langKey: 'APP.VALIDATIONS.FIELD_INVALID',
		regExp: /^[a-zA-Z\s]*$/
	},
	subdomain: {
		langKey: 'APP.VALIDATIONS.FIELD_INVALID',
		regExp: /^[a-z0-9_]+$/
	},
	creditCard: {
		langKey: 'APP.VALIDATIONS.FIELD_INVALID',
		regExp: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
	},
	zip: {
		langKey: 'APP.VALIDATIONS.FIELD_INVALID',
		regExp: /^[0-9]{5}(?:-[0-9]{4})?$/
	},
	phone: {
		langKey: 'APP.VALIDATIONS.FIELD_INVALID',
		regExp: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
	},
	minLength: {
		langKey: 'APP.VALIDATIONS.FIELD_MINLENGTH',
	},
	minLengthOrEqual: {
		langKey: 'APP.VALIDATIONS.FIELD_MINLENGTH_OR_EQUAL',
	},
	maxLength: {
		langKey: 'APP.VALIDATIONS.FIELD_MAXLENGTH',
	},
	digit: {
		langKey: 'APP.VALIDATIONS.FIELD_REQUIRED_DIGIT',
		regExp: /^\d+$/g
	},
	specialChar: {
		langKey: 'APP.VALIDATIONS.FIELD_REQUIRED_SPECIAL_CHAR',
		regExp: /[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g
	},
	lowercaseChar: {
		langKey: 'APP.VALIDATIONS.FIELD_REQUIRED_LOWERCASE_CHAR',
		regExp: /^[a-z]+$/
	},
	uppercaseChar: {
		langKey: 'APP.VALIDATIONS.FIELD_REQUIRED_UPPERCASE_CHAR',
		regExp: /^[A-Z]+$/
	},
	uniqueChars: {
		langKey: 'APP.VALIDATIONS.FIELD_REQUIRED_UNIQUE_CHARS',
		regExp: /(?=^[A-Za-z0-9]+$)(.)+.*\1.*/
	},
	notMaching: {
		langKey: 'APP.VALIDATIONS.FIELD_NOT_MATCHING',
	}
};

export class AppValidator {
	static readonly getLangKey = (validatorName: string) => {
		return Settings[validatorName]?.langKey ?? Settings['default'].langKey;
	};

	/**
	* Verifica si un valor es de tipo boolean.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si es de tipo boolean.
	*/
	static readonly isBoolean = (value: any): boolean =>
		typeof value === 'boolean' || (typeof value === 'object' && typeof value.valueOf() === 'boolean');

	/**
	* Verifica si una cadena es de tipo object.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si una cadena es de tipo object.
	*/
	static readonly isObject = (value: object | Object): boolean => value && (typeof value === 'object');

	/**
	* Verifica si un valor es de tipo string.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si es de tipo string.
	*/
	static readonly isString = (value: any): boolean =>
		(typeof value === 'string' || (typeof value === 'object' && typeof value.valueOf() === 'string')) || false;

	/**
	* Verifica si un valor de tipo string esta vacio o nulo o no definido.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor esta vacio o nulo o no definido.
	*/
	static readonly isEmptyOrNullOrUndefinedString = (value?: string): boolean => !value || value.length === 0;

	/**
	* Verifica si una cadena coincide con el formato de la expresión regular.
	* @param {value} value Valor a verificar.
	* @param {regexp} regexp Expresión regular.
	* @returns Valor booleano que indica si la cadena coincide con el formato de la expresión regular.
	*/
	static readonly isMatch = (value: string, regexp?: RegExp): boolean => (value && regexp && RegExp(regexp).exec(value) !== null) || false;

	/**
	* Verifica si una cadena coincide con el formato de la expresión regular.
	* @param {value} value Valor a verificar.
	* @param {regexp} regexp Expresión regular.
	* @returns Valor booleano que indica si la cadena coincide con el formato de la expresión regular.
	*/
	static readonly isTest = (value: string, regexp?: RegExp): boolean => value && regexp?.test(value) || false;

	/**
	* Verifica si dos cadenas contienen el mismo valor.
	* @param {value} value Valor a verificar.
	* @param {valueMatch} valueMatch Valor a verificar.
	* @returns Valor booleano que indica si dos cadenas son iguales.
	*/
	static readonly isMatching = (value: string, valueMatch: string): boolean => value === valueMatch || false;

	/**
	 * Verifica si el email contiene un formato correcto.
	 * @param {value} value Valor a verificar.
	 * @returns Valor booleano que indica si el email contiene un formato correcto.
	 */
	static readonly isEmail = (value: string): boolean => this.isTest(value, Settings['email'].regExp);

	/**
	* Verifica si el subdominio contiene un formato correcto.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el subdominio contiene un formato correcto.
	*/
	static readonly isSubdomain = (value: string): boolean => this.isMatch(value, Settings['subdomain'].regExp);

	/**
	* Verifica si el valor tiene formato de teléfono.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor tiene formato de teléfono.
	*/
	static readonly isPhone = (value: string): boolean => this.isTest(value, Settings['phone'].regExp);

	/**
	* Verifica si el valor es un zip.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor es un zip.
	*/
	static readonly isZip = (value: string): boolean => this.isTest(value, Settings['zip'].regExp);

	/**
	* Verifica si el valor es una tarjeta de crédito.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor es una tarjeta de crédito.
	*/
	static readonly isCreditCard = (value: string): boolean => this.isTest(value, Settings['creditCard'].regExp);

	/**
	* Verifica si un nombre contiene un formato correcto.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si un nombre contiene un formato correcto.
	*/
	static readonly isName = (value: string): boolean => this.isTest(value, Settings['name'].regExp);

	/**
	* Verifica que un valor contenga mas caracteres que los minimos permitidos.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano => true: significa que el valor contiene mas caracteres que {minLength}
	* @returns Valor booleano => false: significa que el valor contiene menos caracteres que {minLength}
	*/
	static readonly isMinLength = (value: string, minLength: number): boolean => value.length > minLength;

	/**
	* Verifica que un valor contenga mas o igual caracteres que los minimos permitidos.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano => true: significa que el valor contiene mas o igual caracteres que {minLength}
	* @returns Valor booleano => false: significa que el valor contiene menos caracteres que {minLength}
	*/
	static readonly isMinOrEqualLength = (value: string, minLength: number): boolean => value.length >= minLength;

	/**
	* Verifica que un valor contenga menos caracteres que los maximos permitidos.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano => true: significa que el valor contiene menos caracteres que {maxLength}
	* @returns Valor booleano => false: significa que el valor contiene mas caracteres que {minLength}
	*/
	static readonly isMaxLength = (value: string, maxLength: number): boolean => value.length < maxLength;

	/**
	* Verifica que un valor contenga menos o igual caracteres que los maximos permitidos.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano => true: significa que el valor contiene menos o igual caracteres que {maxLength}
	* @returns Valor booleano => false: significa que el valor contiene mas caracteres que {minLength}
	*/
	static readonly isMaxOrEqualLength = (value: string, maxLength: number): boolean => value.length <= maxLength;

	/**
	* Verifica si el valor contiene un número.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor contiene un número.
	*/
	static readonly isHasDigit = (value: any): boolean => this.isTest(value, Settings['digit'].regExp);

	/**
	* Verifica si el valor contiene un caracter especial.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor contiene un caracter especial.
	*/
	static readonly isHasSpecialChar = (value: any): boolean => this.isTest(value, Settings['specialChar'].regExp);

	/**
	* Verifica si el valor contiene un caracter en minúscula.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor contiene un caracter en minúscula.
	*/
	static readonly isHasLowercaseChar = (value: any): boolean => this.isTest(value, Settings['lowercaseChar'].regExp);

	/**
	* Verifica si el valor contiene un caracter en mayúscula.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor contiene un caracter en mayúscula.
	*/
	static readonly isHasUppercaseChar = (value: any): boolean => this.isTest(value, Settings['uppercaseChar'].regExp);

	/**
	* Verifica si el valor contiene caracteres unicos.
	* @param {value} value Valor a verificar.
	* @returns Valor booleano que indica si el valor contiene caracteres unicos.
	*/
	static readonly isHasUniqueChars = (value: any): boolean => this.isTest(value, Settings['uniqueChars'].regExp);
}
