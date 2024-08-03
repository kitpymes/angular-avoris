import { Injectable } from '@angular/core';

import CryptoTSEncrypt from './cryptots.encrypt';
import DefaultEncrypt from './default.encrypt';

@Injectable()
export class EncryptProvider {
   constructor(
   ) { }

   //static get Crypto() { return CryptoTSEncrypt; }
   static get Default() { return DefaultEncrypt; }
}
