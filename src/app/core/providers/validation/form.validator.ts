import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

import { AppValidator } from './validator';

export class AppFormValidator {
	static readonly requiredValidator = (control: AbstractControl): ValidationErrors | null => {
		return Validators.required(control);
	};

	static readonly minLengthValidator = (minLength: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
		if (control.pristine || !control.value || control.value.length > minLength) {
			return null;
		}

		return { minLength: { minLength } };
	};

	static readonly minLengthOrEqualValidator = (minLengthOrEqual: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
		if (control.pristine || !control.value || control.value.length >= minLengthOrEqual) {
			return null;
		}

		return { minLengthOrEqual: { minLengthOrEqual } };
	};


	static readonly creditCardValidator = (control: AbstractControl): ValidationErrors | null => {
		if (!control.value || AppValidator.isCreditCard(control.value)) {
			return null;
		}

		return { creditCard: true };
	};

	static readonly emailValidator = (control: AbstractControl): ValidationErrors | null => {
		if (!control.value || AppValidator.isEmail(control.value)) {
			return null;
		}

		return { email: true };
	};

	static readonly zipValidator = (control: AbstractControl): ValidationErrors | null => {
		if (!control.value || AppValidator.isZip(control.value)) {
			return null;
		}

		return { zip: true };
	};

	static readonly phoneValidator = (control: AbstractControl): ValidationErrors | null => {
		if (!control.value || AppValidator.isPhone(control.value)) {
			return null;
		}

		return { phone: true };
	};

	static readonly subdomainValidator = (control: AbstractControl): ValidationErrors | null => {
		if (control.pristine || !control.value || AppValidator.isSubdomain(control.value)) {
			return null;
		}

		return { subdomain: true };
	};

	static readonly nameValidator = (control: AbstractControl): ValidationErrors | null => {
		if (!control.value || AppValidator.isName(control.value)) {
			return null;
		}

		return { name: true };
	};

	static readonly rangeValidator = (minLength: number, maxLength: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
		if (control.value) {
			if (control.value.length < minLength) {
				return { minLength: { minLength } };
			}

			if (control.value.length > maxLength) {
				return { maxLength: { maxLength } };
			}
		}

		return null;
	};
}
