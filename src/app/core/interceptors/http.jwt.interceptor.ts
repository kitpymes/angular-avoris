import { inject } from '@angular/core';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";


export const httpJwtInterceptor: HttpInterceptorFn = (httpRequest: HttpRequest<any>, httpHandler: HttpHandlerFn) => {
	const jsonWebToken = 'dsadas~#sqd4€¬€¬€~¬54€~#5';

	if (jsonWebToken) {
		httpRequest = httpRequest.clone({
			setHeaders: {
				Authorization: `Bearer ${jsonWebToken}`
			}
		});
	}

	return httpHandler(httpRequest);
};
