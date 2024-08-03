import { EnvironmentProviders, ErrorHandler, makeEnvironmentProviders } from '@angular/core';

import { ClientErrorHandler } from '@core/handlers';

export const provideHandles = (): EnvironmentProviders => {
	return makeEnvironmentProviders([
		{
			provide: ErrorHandler,
			useClass: ClientErrorHandler
		}
	]);
}
