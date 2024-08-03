import { inject } from '@angular/core';
import { Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment, CanMatchFn, CanActivateFn } from '@angular/router';
import { RouteDataModel } from '../routing';

import { LangProvider } from '@shared/components/lang';
import { SnackBarProvider } from '@shared/components/message';
import { AuthService } from '@features/auth';

export const canMatchIsAutenticated: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const authStore = authService.Store();

	if (!authStore.isAutenticated) {
		router.navigate(['/home'], { queryParams: { returnUrl: '/' + route.path } });
		return false;
	}

	return true;
};

export const canActivateHasModule: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const langProvider = inject(LangProvider);
	const snackBarProvider = inject(SnackBarProvider);

	const data = <RouteDataModel>route.data;

	if (!authService.hasModule(data.module)) {
		const translate = langProvider.get('APP.PAGE_UNAUTHORIZED_FORMAT', { PAGE: state.url });
		snackBarProvider.error(translate);
		router.navigate(['/dash']);
		return false;
	}

	return true;
};

export const canActivateHasPermission: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const snackBarProvider = inject(SnackBarProvider);
	const langProvider = inject(LangProvider);

	const data = <RouteDataModel>route.data;

	if (data.permissions && data.permissions?.length > 0 && !authService.hasPermission(...data.permissions)) {
		const translate = langProvider.get('APP.PAGE_UNAUTHORIZED_FORMAT', { PAGE: state.url });
		snackBarProvider.error(translate);
		router.navigate(['/dash']);
		return false;
	}

	return true;
};
