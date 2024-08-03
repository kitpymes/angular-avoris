import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
	provideAngularMaterial,
	provideBaseHref,
	provideRoute,
	provideStringFormat,
	provideInterceptors,
	provideHandles,
} from '.';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAnimations(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideHttpClient(withFetch(), withInterceptors(provideInterceptors)),
		provideRoute(),
		provideHandles(),
		provideBaseHref(),
		provideAngularMaterial(),
		provideStringFormat(),
	],
};
