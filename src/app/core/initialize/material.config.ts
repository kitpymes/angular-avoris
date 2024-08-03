import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FormGroupDirective, NgForm, UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';

export const provideAngularMaterial = (): EnvironmentProviders => {
	class ShowCustomErrorStateMatcher implements ErrorStateMatcher {
		isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
			return !!(control && control.invalid && (control.dirty || control.touched || form?.submitted));
		}
	}
	return makeEnvironmentProviders([
		{
			provide: APP_INITIALIZER,
			multi: true,
			deps: [MatIconRegistry],
			useFactory: (matIconRegistry: MatIconRegistry) => {
				return () => {
					matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
				}
			}
		},
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', hideRequiredMarker:'false', floatLabel:'auto' } },
		{ provide: ErrorStateMatcher, useClass: ShowCustomErrorStateMatcher },
	]);
}
