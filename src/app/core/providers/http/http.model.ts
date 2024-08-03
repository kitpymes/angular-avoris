import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface AppHttpOptions {
   headers?: HttpHeaders | { [header: string]: string | string[]; };
   observe?: 'body' | 'events' | 'response' | any;
   params?: HttpParams | { [param: string]: string | string[]; };
   reportProgress?: boolean;
   responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | any;
   withCredentials?: boolean;
   body?: any | null;
   showLoader?: boolean;
};

export enum AppHttpStatus { Success = 200, BadRequest = 400, Unauthorized = 401, InternalServerError = 500 };
export enum AppHttpMethod { Get = 'GET', Post = 'POST', Put = 'PUT', Delete = 'DELETE' };
export enum AppHttpRequestType {
   Json = '{ "Content-Type": "application/json" }',
   Html = '{ "Content-Type": "application/x-www-form-urlencoded" }'
};
