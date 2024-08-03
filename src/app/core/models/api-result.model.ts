interface IApiResultBase {
	success: boolean;
	status?: number;
	title?: string;
}

interface IApiResultOk extends IApiResultBase {
	data?: any;
}

interface IApiResultError extends IApiResultBase {
	traceId?: string;
	exception?: string;
	message?: string;
	errors?: [string, string[]][];
	details?: any;
}

export interface IApiResult extends IApiResultError, IApiResultOk {
}

export class ApiResult implements IApiResult {
	success: boolean = true;
	status?: number;
	title?: string;
	traceId?: string;
	exception?: string;
	message?: string;
	details?: any;
	data?: any;
	errors?: [string, string[]][];
}
