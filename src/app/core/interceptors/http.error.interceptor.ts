import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, tap } from "rxjs";

import { ErrorProvider } from "../providers/error";

export const httpErrorInterceptor: HttpInterceptorFn = (httpRequest: HttpRequest<any>, httpHandler: HttpHandlerFn) => {
	const errorProvider = inject(ErrorProvider);

	return httpHandler(httpRequest).pipe(
		tap({
			next: event => {
				if (event instanceof HttpResponse) {
					const result = <any>event.body;

					if (!event.ok) {
						errorProvider.showServerError(result);
					}
				}
			}
		}),
		catchError((res: HttpErrorResponse) => errorProvider.showCatchError(res))
	);
};
