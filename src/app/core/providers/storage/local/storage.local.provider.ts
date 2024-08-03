import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { EncryptProvider } from '@core/providers/encrypt';
import { randomString, bytesFormat } from '@core/utils';

@Injectable({ providedIn: "root" })
export class StorageLocalProvider {
	static isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        StorageLocalProvider.isBrowser = isPlatformBrowser(platformId);
    }

	static get<T extends object | string>(key: string): T | null | undefined {
		if (this.isBrowser) {
			if (!key) {
				return null;
			}

			if (!this.has(key)) {
				return null;
			}

			const data = localStorage.getItem(key);

			if (!data) {
				return null;
			}

			try {
				return EncryptProvider.Default.Decrypt<T>(key, data);
			} catch (error) {
				throw new Error(`Ocurrio un error al queres desencriptar con la key: "${key}" en el localStorage.`);
			}
		}

		return null;
	}

	static set<T extends object | string>(key: string, data: T): void {
		if (this.isBrowser) {
			if (!key) {
				throw new Error(`El parámetro "key" es obligatorio.`);
			}

			if (!data) {
				throw new Error(`El parámetro "data" es obligatorio.`);
			}

			if (!this.isSupported()) {
				return;
			}

			if (!this.isSpace()) {
				return;
			}

			try {
				const encryptData = EncryptProvider.Default.Encrypt<T>(key, data);

				localStorage.setItem(key, encryptData);
			} catch (error) {
				throw new Error(`Ocurrio un error al querer encriptar con la key: "${key}" en el localStorage.`);
			}
		}
	}

	static readonly remove = (key: string): void => StorageLocalProvider.isBrowser ? localStorage.removeItem(key) : undefined;

	static readonly removeAll = (): void => StorageLocalProvider.isBrowser ? localStorage.clear() : undefined;

	static readonly size = (): number | undefined => StorageLocalProvider.isBrowser ? localStorage.length : undefined;

	static readonly has = (key: string): boolean | undefined => StorageLocalProvider.isBrowser ? localStorage.getItem(key) !== null : undefined;

	static readonly keys = (): string[] => StorageLocalProvider.isBrowser ? Object.keys(window.localStorage) : [];

	static isSpace(): boolean {
		let listData!: string;
		let title = 'localStorage: ';
		let message: string[] = [];

		for (let key of this.keys()) {
			const storageData = window.localStorage[key];
			listData += storageData;
			message.push(`${key}: used ${bytesFormat(storageData.length)}`);
		}

		message = message.sort((a: any, b: any) => a - b);

		const maxSpace = 5120;
		const usedSpace = listData?.length ?? 0;
		const freeSpace = listData && (maxSpace - listData.length) || maxSpace;
		const porcentUsedSpace = ((usedSpace * 100) / maxSpace).toFixed(2);
		const porcentFreeSpace = ((freeSpace * 100) / maxSpace).toFixed(2);

		if (usedSpace > 4000) {
			title += `Total used: ${bytesFormat(usedSpace)} (${porcentUsedSpace} %) | Total free: ${bytesFormat(freeSpace)} (${porcentFreeSpace} %)`;
		}

		return freeSpace > 1;
	}

	private static isSupported() {
		try {
			const key = randomString();
			window.localStorage.setItem(key, key);
			window.localStorage.removeItem(key);
			return true;
		} catch (e) {
			return false;
		}
	}
}
