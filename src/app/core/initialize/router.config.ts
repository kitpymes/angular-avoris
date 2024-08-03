import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, provideRouter, withInMemoryScrolling, withEnabledBlockingInitialNavigation, withViewTransitions, withHashLocation, withComponentInputBinding, withRouterConfig, withPreloading } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { LoadingProvider, LoadingRef } from '@shared/components/loading';
import { routes } from '@features/features.routing';

const loadingFactory = (router: Router, loadingProvider: LoadingProvider) => {
	return () => {
		let loadingRef: LoadingRef<MatProgressSpinner> | null;

		router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				loadingRef = loadingProvider.spin();
			} else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
				loadingRef?.close();
			}
		});
	};
};


export const provideRoute = (): EnvironmentProviders => {
	return makeEnvironmentProviders([
		provideRouter(routes,
			withInMemoryScrolling({
				scrollPositionRestoration: 'top',
			}),
			//withDebugTracing(),
			withEnabledBlockingInitialNavigation(),
			withViewTransitions(),
			withHashLocation(),
			withComponentInputBinding(),
			withRouterConfig({
				paramsInheritanceStrategy: 'always',
				onSameUrlNavigation: 'reload',
			}),
		),
		{
			provide: APP_INITIALIZER,
			multi: true,
			deps: [Router, LoadingProvider],
			useFactory: loadingFactory
		},
	]);
}
