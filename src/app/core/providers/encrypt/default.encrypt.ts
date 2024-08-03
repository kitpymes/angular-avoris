import { tryParseJSON } from '@core/utils/string.util';
import { AppValidator } from '../validation/validator';

export default class DefaultEncrypt {
   static Encrypt<T extends object | string>(key: string, data: T): string {
      if (!key || !data) {
         throw new Error('Crypto.DecryptObject() "parameters is empty"');
      }

      const string: string = AppValidator.isObject(data) ? JSON.stringify(data) : data.toString();
      const char: string[] = string.split('')
      return char.map(val => this.toCode(val, key)).join('');
   }

   static Decrypt<T extends object | string>(key: string, data: string): T | null {
      if (!key) {
         throw new Error(`El parámetro "key" es obligatorio.`);
      }

      if (!data) {
         throw new Error(`El parámetro "data" es obligatorio.`);
      }

      const char: RegExpMatchArray | null = data.match(/.{4}/g);
      const result = char && char.map(val => this.toChar(val, key)).join('') || null;

      return result && tryParseJSON<T>(result) || null;
   }

   private static toCode = (char: string, key: string): string => {
      const keyArr: string[] = key.split('')
      const charCode: string = char.charCodeAt(0).toString(4)
      const charCodeFull: string = '0'.repeat(4 - charCode.length) + charCode

      return keyArr.reduce((current, dna, index) => {
         const regex = new RegExp(index.toString(), 'g')
         return current.replace(regex, dna)
      }, charCodeFull)
   }

   private static toChar = (code: string, key: string): string => {
      const keyArr: string[] = key.split('')
      const charCode: string = keyArr.reduce((current, dna, index) => {
         const regex = new RegExp(dna, 'g')
         return current.replace(regex, index.toString())
      }, code)

      return String.fromCharCode(parseInt(charCode, 4))
   }
}
