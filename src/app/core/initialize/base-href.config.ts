import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

export const provideBaseHref = (): EnvironmentProviders => {
	return makeEnvironmentProviders([
		{ provide: APP_BASE_HREF, useValue: '/' },
	]);
}
