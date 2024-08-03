import { inject } from '@angular/core';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { finalize } from 'rxjs/operators';

import { LoadingProvider, LoadingRef } from '@shared/components/loading';

export const httpLoadingInterceptor: HttpInterceptorFn = (httpRequest: HttpRequest<any>, httpHandler: HttpHandlerFn) => {
	let loadingRef!: LoadingRef | null;
	let _activeRequests = 0;
	const _skippUrls = ['/authrefresh'];
	const loadingProvider = inject(LoadingProvider);

	if (_skippUrls.includes(httpRequest.url)) {
		return httpHandler(httpRequest);
	}

	if (_activeRequests === 0) {
		loadingRef = loadingProvider.spin();
	}

	_activeRequests++;

	return httpHandler(httpRequest).pipe(
		finalize(() => {
			_activeRequests--;

			if (_activeRequests === 0) {
				loadingRef?.close();
			}
		})
	);
};
