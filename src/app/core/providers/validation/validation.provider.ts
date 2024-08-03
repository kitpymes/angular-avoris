
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';

import { LangProvider } from '@shared/components/lang';
import { AppValidator } from './validator';
import { PasswordErrorResult, PasswordSettings } from './password-validator/password.model';
import { passwordValidator } from './password-validator/password.validator';

@Injectable({ providedIn: 'root' })
export class ValidationProvider {
	private langProvider = inject(LangProvider);

	/**
	* Verifica si el valor contiene una contraseña valida.
	* @param {value} value Valor a verificar.
	* @param {settings} settings Configuración de los caracteres requeridos de la contraseña.
	* @returns Un boolean que indica si es valido y si no es valido tambien retorna una lista con los mensajes de errores econtrados.
	*/

	/*
	public passwordValidation = (value: string, settings?: PasswordSettings, enabled = true): string[] | null | undefined => {
		if (enabled) {
			const passwordResult = passwordValidator(value, settings, enabled);

			if (passwordResult.isValid) {
				return null;
			}

			let errors!: string[];

			passwordResult.errors?.forEach((error: string) => {
				switch (error) {
					case PasswordErrorResult.RequireDigit:
						errors.push(this.langProvider.get(AppValidator.getLangKey('digit')));
						break;
					case PasswordErrorResult.RequireEspecialChars:
						errors.push(this.langProvider.get(AppValidator.getLangKey('specialChar')));
						break;
					case PasswordErrorResult.RequireLowercase:
						errors.push(this.langProvider.get(AppValidator.getLangKey('lowercaseChar')));
						break;
					case PasswordErrorResult.RequireUppercase:
						errors.push(this.langProvider.get(AppValidator.getLangKey('uppercaseChar')));
						break;
					case PasswordErrorResult.RequiredMinLength:
						errors.push(this.langProvider.get(AppValidator.getLangKey('minLength'), { minLength: settings?.RequiredMinLength ?? environment.passwordSettings.RequiredMinLength }));
						break;
					case PasswordErrorResult.RequiredUniqueChars:
						errors.push(this.langProvider.get(AppValidator.getLangKey('uniqueChars')));
						break;
					case PasswordErrorResult.RequiredValue:
						errors.push(this.langProvider.get(AppValidator.getLangKey('required')));
						break;
					default:
						break;
				}
			});

			return errors;
		}
*/

/*

		const defaultSettings = <PasswordSettings>{
			RequiredValue: true, // (bool) Default: true
			RequireDigit: false, // (bool) Default: false
			RequireLowercase: false, // (bool) Default: false
			RequireUppercase: false, // (bool) Default: false
			RequireEspecialChars: false, // (bool) Default: false
			RequiredUniqueChars: false, // (bool) Default: false
			RequiredMinLength: 6, // (int) Default: 6
		};

		let passwordResult: PasswordResult = {
			isValid: true,
			errors: [],
		};

		if (enabled) {
			const config = { ...defaultSettings, ...settings };

			if (config.RequiredValue) {
				if (AppValidator.isEmptyOrNullOrUndefinedString(value)) {
					passwordResult.errors?.push(this.langProvider.get(AppValidator.getLangKey('required')));
				}
			}

			if (config.RequireDigit) {
				if (!AppValidator.isHasDigit(value)) {
					passwordResult.errors?.push(this.langProvider.get(AppValidator.getLangKey('digit')));
				}
			}

			if (config.RequiredMinLength) {
				if (!AppValidator.isMinOrEqualLength(value, config.RequiredMinLength)) {
					passwordResult.errors?.push(this.langProvider.get(AppValidator.getLangKey('minLength'), { minLength: config.RequiredMinLength }));
				}
			}

			if (config.RequireEspecialChars) {
				if (!AppValidator.isHasSpecialChar(value)) {
					passwordResult.errors?.push(this.langProvider.get(AppValidator.getLangKey('specialChar')));
				}
			}

			if (config.RequireLowercase) {
				if (!AppValidator.isHasLowercaseChar(value)) {
					passwordResult.errors?.push(this.langProvider.get(AppValidator.getLangKey('lowercaseChar')));
				}
			}

			if (config.RequireUppercase) {
				if (!AppValidator.isHasUppercaseChar(value)) {
					passwordResult.errors?.push(this.langProvider.get(AppValidator.getLangKey('uppercaseChar')));
				}
			}

			if (config.RequiredUniqueChars) {
				if (!AppValidator.isHasUniqueChars(value)) {
					passwordResult.errors?.push(this.langProvider.get(AppValidator.getLangKey('uniqueChars')));
				}
			}

			passwordResult.isValid = passwordResult.errors?.length === 0;
		}

		return passwordResult;

	};*/
}
