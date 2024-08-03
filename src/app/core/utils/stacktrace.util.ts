export interface IStackFrame {
   isConstructor?: boolean;
   isEval?: boolean;
   isNative?: boolean;
   isTopLevel?: boolean;
   columnNumber?: number;
   lineNumber?: number;
   fileName?: string;
   functionName?: string;
   source?: string;
   args?: any[];
   evalOrigin?: IStackFrame;
}

export class StackTraceUtil {
   private static FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
   private static CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
   private static SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

   /**
    *Parse error navigators.
    *
    * @static
    * @param {*} error
    * @returns {IStackFrame[]}
    * @memberof ErrorStackParserProvider
    */
   static parse(error: any): IStackFrame[] {
      try {
         if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
            return this.parseOpera(error);
         } else if (error.stack && error.stack.match(this.CHROME_IE_STACK_REGEXP)) {
            return this.parseV8OrIE(error);
         } else if (error.stack) {
            return this.parseFFOrSafari(error);
         }
      } catch (er) {

      }

      return [];
   }

   private static parseV8OrIE(error: any): IStackFrame[] {
      const filtered = error.stack.split('\n').filter((line: any) =>
         !!line.match(this.CHROME_IE_STACK_REGEXP), this);

      return filtered.map((line: any) => {
         if (line.indexOf('(eval ') > -1) {
            // Throw away eval information until we implement stacktrace.js/stackframe#8
            line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
         }
         const tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
         const locationParts = this.extractLocation(tokens.pop());
         const functionName = tokens.join(' ') || undefined;
         const fileName = locationParts[0] && ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

         return {
            functionName: functionName,
            fileName: fileName,
            lineNumber: locationParts[1],
            columnNumber: locationParts[2],
            source: line
         };
      }, this);
   }

   private static parseFFOrSafari(error: any): IStackFrame[] {
      const filtered = error.stack.split('\n').filter((line: any) =>
         !line.match(this.SAFARI_NATIVE_CODE_REGEXP), this);

      return filtered.map((line: any) => {
          // Throw away eval information until we implement stacktrace.js/stackframe#8
          if (line.indexOf(' > eval') > -1) {
              line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
          }

          if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
              // Safari eval frames only have function names and nothing else
              return {
                  functionName: line
              };
          } else {
            const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
              const matches = line.match(functionNameRegex);
              const functionName = matches && matches[1] ? matches[1] : undefined;
              const locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

              return {
                  functionName: functionName,
                  fileName: locationParts[0],
                  lineNumber: locationParts[1],
                  columnNumber: locationParts[2],
                  source: line
              };
          }
      }, this);
  }

   //#region Opera

   private static parseOpera(error: any): IStackFrame[] {
      if (!error.stacktrace || (error.message.indexOf('\n') > -1 &&
         error.message.split('\n').length > error.stacktrace.split('\n').length)) {
         return this.parseOpera9(error);
      } else if (!error.stack) {
         return this.parseOpera10(error);
      } else {
         return this.parseOpera11(error);
      }
   }

   private static parseOpera9(error: any): IStackFrame[] {
      const lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
      const lines = error.message.split('\n');
      let result: IStackFrame[] = [];

      for (let i = 2, len = lines.length; i < len; i += 2) {
         const match = lineRE.exec(lines[i]);
         if (match) {
            const newLine: IStackFrame = {
               fileName: match[2],
               lineNumber: +match[1],
               source: lines[i]
            };

            result = [...result, newLine];
         }
      }

      return result;
   }

   private static parseOpera10(error: any): IStackFrame[] {
      const lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
      const lines = error.stacktrace.split('\n');
      let result: IStackFrame[] = [];

      for (let i = 0, len = lines.length; i < len; i += 2) {
         const match = lineRE.exec(lines[i]);
         if (match) {
            const newLine: IStackFrame = {
               functionName: match[3] || undefined,
               fileName: match[2],
               lineNumber: +match[1],
               source: lines[i]
            };

            result = [...result, newLine];
         }
      }

      return result;
   }

   // Opera 10.65+ Error.stack very similar to FF/Safari
   private static parseOpera11(error: any): IStackFrame[] {
      const filtered = error.stack.split('\n').filter((line: any) =>
         !!line.match(this.FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/), this);

      return filtered.map((line: any) => {
         const tokens = line.split('@');
         const locationParts = this.extractLocation(tokens.pop());
         const functionCall = (tokens.shift() || '');
         const functionName = functionCall
            .replace(/<anonymous function(: (\w+))?>/, '$2')
            .replace(/\([^\)]*\)/g, '') || undefined;
         let argsRaw;
         if (functionCall.match(/\(([^\)]*)\)/)) {
            argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
         }
         const args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
            undefined : argsRaw.split(',');

         return {
            functionName: functionName,
            args: args,
            fileName: locationParts[0],
            lineNumber: locationParts[1],
            columnNumber: locationParts[2],
            source: line
         };
      }, this);
   }

   //#endregion Opera

   // Separate line and column numbers from a string of the form: (URI:Line:Column)
   private static extractLocation(urlLike: string) {
      // Fail-fast but return locations like "(native)"
      if (urlLike.indexOf(':') === -1) {
         return [urlLike];
      }

      const regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
      const parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
      return [parts && parts[1] || undefined, parts && parts[2] || undefined, parts && parts[3] || undefined];
   }
}
