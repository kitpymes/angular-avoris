import { Routes } from '@angular/router';

import { SiteLayoutComponent } from '@shared/components/layouts';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: 'home',
		pathMatch: 'full',
		component: SiteLayoutComponent,
		loadChildren: () => import('@features/home/home.routing').then(m => m.HOME_ROUTES),
	},

	{ path: '**', redirectTo: 'home', pathMatch: 'prefix' }
];
