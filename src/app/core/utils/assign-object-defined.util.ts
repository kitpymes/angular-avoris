/**
 * Use:
 *

   const assignObjectsDefined = <T extends Object | any = any>(target: T, ...sources: T[]) => {
      console.log('*** assignObjectsDefined ***')
      for (const source of sources) {
         for (const key of Object.keys(source)) {
            const val = source[key];
            if (val) {
                  target[key] = val;
            }
         }

         console.log(`Clone source:`, source);
      }

      console.log(`Result:`, target);

      return target;
   }

   interface User { x: number; y: string };
   const defaults: User = { x: 1, y: "11111" };
   const customs: User = { x: 2, y: "22222" };
   const customs1: User = { x: 3, y: "33333" };
   const customs2: User = { x: null, y: "" };
   const settings = assignObjectsDefined<User>(defaults, customs, customs1, customs2);

 *
 *
 * @param target
 * @param sources
 */
export const assignObjectsDefined = <T extends Object, U extends T | any>(target: T, ...sources: U[]) => {
   if (sources) {
      for (const source of sources) {
         if (typeof source === "object") {
            const sourceObject =  <T><unknown>source;
            for (const key of Object.keys(sourceObject)) {
               const keyType = key as keyof T;
               const val = sourceObject[keyType];

               if (typeof val !== undefined) {
                  target[keyType] = val;
               }
            }
         }
      }
   }

   return target;
}
