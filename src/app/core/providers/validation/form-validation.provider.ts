import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, UntypedFormGroup, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { AppValidator } from './validator';

export declare interface ServerError {
	[key: string]: [];
}

@Injectable({ providedIn: 'root' })
export class FormValidationProvider {
	private form!: UntypedFormGroup;
	private serverError: any;
	private errorObject!: ServerError;
	private message!: string;

	/**
	 * @property {boolean} untouched Verdadero si el usuario no ha visitado el elemento.
	 * @property {boolean} touched Verdadero si el usuario ha visitado el elemento.
	 * @property {boolean} pristine Verdadero si el contenido del elemento no ha cambiado.
	 * @property {boolean} dirty Verdadero si se ha cambiado el contenido del elemento.
	*/
	readonly hasError = (control: AbstractControl): boolean => control.invalid && (control.dirty || control.touched);

	/**
	 * Takes server error obj and set errors to appropriate fields at form given.
	 *
	 * @param serverError       Error object that is received from the server
	 * @param form              Form to which errors belong to.
	 */
	public organizeServerErrors = (serverError: ServerError, form: UntypedFormGroup) => {
		if (serverError && typeof serverError === 'object') {
			this.form = form;
			this.serverError = serverError;
			this.setErrorToFormFields();
			this.findErrors(form.controls);
		}
	};

	/**
	 * Listen's for invalid status of the form given and find's it's errors.
	 *
	 * @param form              Form to be listened
	 * @param errorObject       Error object which to set errors.
	 */
	public handleErrors = (form: { group: UntypedFormGroup; errors: any; }) => {
		this.form = form.group;
		this.errorObject = form.errors;

		this.form.valueChanges.pipe(
			debounceTime(500),
			distinctUntilChanged(),
		).subscribe(() => {
			if (this.form.invalid) {
				this.findErrors(this.form.controls);
			}
		});
	};

	/** Used to call when an invalid form has been submit
	 *  By setting error we emit a status changed event for the form.
	 */
	public invalidFormHasSubmit = (): void => {
			this.form?.markAllAsTouched();
		this.form?.setErrors({});
	};

	// #region private

	/** Finds appropriate fields on form and set's the server error. */
	private setErrorToFormFields = () => {
		Object.keys(this.serverError).forEach(field => {
			if (!Array.isArray(this.serverError[field])) {
				this.setErrorsToNestedFields(field);
			} else {
				const errorMessages: any[] = this.serverError[field];
				this.form.get(field)?.setErrors({ serverError: errorMessages[0].message });
			}
		});
	};

	/**
	 * Takes nested field name and set's server error to appropriate nested field.
	 * @param nestedFieldName       Usually formControlName of a FormArray.
	 */
	private setErrorsToNestedFields = (nestedFieldName: string) => {
		const nestedFormErrors = this.serverError[nestedFieldName];
		Object.keys(nestedFormErrors).forEach(field => {
			const formControl = this.form.get(field);
			if (formControl) {
				formControl.setErrors({ serverError: nestedFormErrors[field] });
			} else {
				const nestedForm = this.form.get(nestedFieldName);
				const nestedField = nestedForm?.get(field);
				if (nestedField) {
					nestedField.setErrors({ serverError: nestedFormErrors[field] });
				}
			}
		});
	};

	/**
	 * Find which control contains the error and set required { control -> error message } combination
	 * into the errorObject given previously.
	 *
	 * @param controls      Abstract Controls of the form which contains errors.
	 */
	private findErrors = (controls: { [key: string]: AbstractControl }) => {
		Object.keys(controls).forEach((control: string) => {
			if (controls[control] instanceof UntypedFormArray) {
				Object.defineProperty(this.errorObject, control, { value: [], writable: true });
				this.findErrorsOnFormArrays(controls[control] as UntypedFormArray, control);
			} else if (controls[control] instanceof UntypedFormControl) {
				this.findErrorsOnFormControls(controls, control);
			}
		});
	};

	private findErrorsOnFormArrays = (formArray: UntypedFormArray, formArrayName: string) => {
		let i = 0;
		for (const formGroup of formArray.controls as UntypedFormGroup[]) {
			const controls = formGroup.controls;
			const formArrayErrors: any[] = this.errorObject[formArrayName];
			formArrayErrors.push({});
			Object.keys(controls).forEach(control => {
				const ctrl = controls[control];

				if (ctrl && this.hasError(ctrl)) {
					if (ctrl.errors) {
						this.setErrorMessage(ctrl.errors);
					}
					Object.defineProperty(formArrayErrors[i], control, { value: this.message, writable: true });
				}
			});
			i++;
		}
	};

	private findErrorsOnFormControls = (controls: { [key: string]: AbstractControl }, control: string) => {
		const ctrl = controls[control];

		if (ctrl && this.hasError(ctrl)) {
			if (ctrl.errors) {
				this.setErrorMessage(ctrl.errors);
			}
			this.setErrorToErrorObject(control);
		}
	};

	/**
	 * Busca el primer error del control y setea el mensaje.
	 *
	 * @param errors ValidationErrors.
	 */
	private setErrorMessage(errors: ValidationErrors) {
		const validatorName = Object.keys(errors)[1] ?? Object.keys(errors)[0];
		const validatorValue = errors[validatorName];
		const translate = validatorValue;
		this.message = translate;
	}

	/**
	 * Busca todos los errores del control y setea todos los mensaje.
	 *
	 * @param errors ValidationErrors.
	 */
	private setErrorsMessage = (errors: ValidationErrors) => {
		this.message = "";

		Object.keys(errors).forEach(validatorName => {
			const validatorValue = errors[validatorName];
			const translate = validatorValue;
			this.message = this.message ? this.message.concat(' ' + translate) : translate;
		});
	};

	/**
	 * Set's a new property to errorObject with key from the field's name and error message as a value.
	 * @param field         Field which contains error.
	 */
	private setErrorToErrorObject = (field: string) => Object.defineProperty(this.errorObject, field, { value: this.message, writable: true });

	// #endregion private
}
