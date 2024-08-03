import { ErrorHandler, Injectable, inject } from '@angular/core';

import { ErrorProvider } from '@core/providers/error';

@Injectable()
export class ClientErrorHandler implements ErrorHandler {
	private readonly errorProvider = inject(ErrorProvider);

	handleError = (error: any) => (this.errorProvider ?? inject(ErrorProvider)).showClientError(error);
}
