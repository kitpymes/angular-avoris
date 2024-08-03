//import * as CryptoTS from 'crypto-ts';

import { tryParseJSON } from '@core/utils/string.util';
import { AppValidator } from '../validation/validator';

const CryptoTS: any = {};

const Settings = {
   keySize: 256 / 32,
   iterations: 100,
   encrypt: {
      salt: CryptoTS.lib.WordArray.random(length / 8),
      initialVector: CryptoTS.lib.WordArray.random(length / 8),
      padding: CryptoTS.pad.PKCS7,
      mode: CryptoTS.mode.CBC
   },
   decript: {
      encoder: CryptoTS.enc.Utf8
   }
};

export default class CryptoTSEncrypt {
   static Encrypt<T extends object | string>(key: string, data: T): string {
      if (!key || !data) {
         throw new Error('Crypto.DecryptObject() "parameters is empty"');
      }

      const string: string = AppValidator.isObject(data) && JSON.stringify(data) || data.toString();
      return CryptoTS.AES.encrypt(string, key).toString();
   }

   static Decrypt<T extends object | string>(key: string, data: string): T | null {
      if (!key || !data) {
         throw new Error('Crypto.DecryptObject() "parameters is empty"');
      }

      let bytes = CryptoTS.AES.decrypt(data, key);
      return bytes && tryParseJSON<T>(bytes.toString(CryptoTS.enc.Utf8)) || null;
   }
}
