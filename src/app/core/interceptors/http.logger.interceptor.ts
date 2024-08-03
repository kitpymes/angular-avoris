import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { finalize, tap } from 'rxjs/operators';

import { ApiResult } from '@core/models';

export const httpLoggerInterceptor: HttpInterceptorFn = (httpRequest: HttpRequest<any>, httpHandler: HttpHandlerFn) => {
	const startTime = Date.now();
	let status: string;
	let result: any;

	return httpHandler(httpRequest).pipe(
		tap({
			next: event => {
				if (event instanceof HttpResponse) {
					result = event.body;
					status = result ? 'succeeded' : 'failed';
				}
			},
			error: error => status = 'failed'
		}),
		finalize(() => {
			const elapsedTime = Date.now() - startTime;
			const title = `${httpRequest.method}: "${httpRequest.urlWithParams}" ${status} in ${elapsedTime}ms`;

			if (result.success) {
				console.info(title, { request: httpRequest.body, response: result });
			} else {
				console.info(title);
			}
		})
	);
};
