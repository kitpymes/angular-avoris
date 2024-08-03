import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '@env/environment';
import { ApiResult } from '@core/models';
import { assignObjectsDefined } from '@core/utils';
import { AppHttpOptions, AppHttpRequestType } from '@core/providers/http';

@Injectable({ providedIn: 'root' })
export class HttpProvider {
	private readonly apiUrl = `${environment.apiUrl}/`;
	private readonly http = inject(HttpClient);

	/**
	 * @property {method} method = 'GET'
	 * @property {requestType} requestType = 'json'
	 * @property {responseType} responseType = 'json'
	 * @property {observe} observe = 'body'
	 *
	 * @param {string} relativeUrl
	 * @param {AppHttpOptions} [options]
	 * @returns {Observable<ApiResult>}
	 * @memberof HttpProvider
	 */
	get = <TResult>(relativeUrl: string, options?: AppHttpOptions): Observable<TResult> =>
		this.http.get<TResult>(this.apiUrl + relativeUrl, assignObjectsDefined({
			headers: new HttpHeaders(AppHttpRequestType.Json),
      Accept: "application/json",
		}, options));

	/**
	 * @property {method} method = 'POST'
	 * @property {requestType} requestType = 'html'
	 * @property {responseType} responseType = 'json'
	 * @property {observe} observe = 'body'
	 *
	 * @param {string} relativeUrl
	 * @param {any} body
	 * @param {AppHttpOptions} [options]
	 * @returns {Observable<ApiResult>}
	 * @memberof HttpProvider
	 */
	post = (relativeUrl: string, body: any, options?: AppHttpOptions): Observable<ApiResult> =>
		this.http.post<ApiResult>(this.apiUrl + relativeUrl, body, assignObjectsDefined({
			headers: new HttpHeaders(AppHttpRequestType.Html)
		}, options));

	/**
	* @property {method} method = 'PUT'
	* @property {requestType} requestType = 'json'
	* @property {responseType} responseType = 'json'
	* @property {observe} observe = 'body'
	*
	* @param {string} relativeUrl
	* @param {any} body
	* @param {AppHttpOptions} [options]
	* @returns {Observable<ApiResult>}
	* @memberof HttpProvider
	*/
	put = (relativeUrl: string, body: any, options?: AppHttpOptions): Observable<ApiResult> =>{
		const url = this.apiUrl + relativeUrl,
			optionsMerge = assignObjectsDefined({
				headers: new HttpHeaders(AppHttpRequestType.Json)
			}, options);

		return this.http.put<ApiResult>(url, body, optionsMerge);
	};

		/**
	* @property {method} method = 'DELETE'
	* @property {requestType} requestType = 'json'
	* @property {responseType} responseType = 'json'
	* @property {observe} observe = 'body'
	*
	* @param {string} relativeUrl
	* @param {AppHttpOptions} [options]
	* @returns {Observable<ApiResult>}
	* @memberof HttpProvider
	*/
	delete = (relativeUrl: string, options?: AppHttpOptions): Observable<ApiResult> =>
		this.http.delete<ApiResult>(this.apiUrl + relativeUrl, assignObjectsDefined({
			headers: new HttpHeaders(AppHttpRequestType.Json),
		}, options));
}
