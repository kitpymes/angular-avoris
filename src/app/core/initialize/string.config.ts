import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

declare global {
	interface String {
		format(...args: (string | number)[]): string;
	}
}

const formatFactory = () => {
	return () => {
		if (!String.prototype.format) {
			String.prototype.format = function () {
				const args = arguments;
				const regex = /\{(\d+)\}/g;
				const func = (match: string, index: number) => index in args ? args[index] : match;

				return this.replace(regex, func);
			};
		}
		return '';
	};
};

export const provideStringFormat = (): EnvironmentProviders => {
	return makeEnvironmentProviders([
		{
			provide: APP_INITIALIZER,
			multi: true,
			useFactory: formatFactory
		},
	]);
}
