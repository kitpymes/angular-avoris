import { Injectable } from '@angular/core';

@Injectable({providedIn: "root"})
export class StorageCookieProvider {
   static get(key: string): string {
      const decodedCookie: string = decodeURIComponent(document.cookie);
      const pairs: string[] = decodedCookie.split(/;\s*/);

      const prefix = `${key}=`;

      for (const pair of pairs) {
         if (pair.startsWith(prefix)) {
            return pair.substring(prefix.length);
         }
      }
      return "";
   }

   static set(key: string, value: string): void;
   static set(key: string, value: string, expires: Date): void;
   static set(key: string, value: string, expires?: Date): void {
      let cookieValue = `${key}=${value}`;

      if (expires){
          cookieValue += `;expires='${expires.toUTCString()}'`
      }

      document.cookie = cookieValue;
   }

   static setWithExpiryInYears(key: string, value: string, expires: number) {
      this.setWithExpiryInDays(key, value, expires * 365);
   }

   static setWithExpiryInDays(key: string, value: string, expires: number) {
      this.setWithExpiryInHours(key, value, expires * 24);
   }

   static setWithExpiryInHours(key: string, value: string, expires: number) {
      this.setWithExpiryInMinutes(key, value, expires * 60);
   }

   static setWithExpiryInMinutes(key: string, value: string, expires: number) {
      this.setWithExpiryInSeconds(key, value, expires * 60);
   }

   static setWithExpiryInSeconds(key: string, value: string, expires: number) {
      this.setWithExpiryInMiliseconds(key, value, expires * 1000);
   }

   static setWithExpiryInMiliseconds(key: string, value: string, expires: number) {
      const expireDate = new Date();
      const time = expireDate.getTime() + expires;
      expireDate.setTime(time);

      this.set(key, value, expireDate);
   }

    /**
     * @param key Cookie key
     */
    static has = (key: string): boolean => {
        key = encodeURIComponent(key);

        const regExp: RegExp = StorageCookieProvider.getCookieRegExp(key);
        const exists: boolean = regExp.test(document.cookie);

        return exists;
    }

	 /**
     * @param key Cookie key
     */
	 static getCookieRegExp(key: string): RegExp {
        const escapedName: string = key.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');

        return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
    }

}
