import memoizee from 'memoizee';

export const StorageMethodCacheProvider = (options?: memoizee.Options<any>) => (target: Object, propertyKey: string, descriptor: PropertyDescriptor): any => {
   const oldFunction = descriptor.value;
   const newFunction = memoizee(oldFunction, options);
   descriptor.value = (...args: any[]) => newFunction.apply(this, args);
};

var cacheList: any = {};

/**
* @name cache
* @description El resultado del método decorado se guarda en memoria para luego obtenerlo del cache.
* @param target {Object} El método decorado.
* @param propertyKey {string} El nombre del método decorado.
* @param descriptor {PropertyDescriptor} Las propiedades del descripctor @see Object.getOwnPropertyDescriptor()
* @return {PropertyDescriptor} Un descriptor para ser usado para la asignación de propiedades.
*/
const cache = (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
   const oldFunction = descriptor.value;
   const cached = cacheList[oldFunction];
   if (cached) {
      console.info(`Get exist cache: ${propertyKey}()`);
      return cached;
   }

   descriptor.value = (...args: any[]) => {
      const value = oldFunction();
      cacheList[oldFunction] = value;
      console.info(`Save new value cache: ${propertyKey}()`);
   }

   return descriptor;
}

let memo = (fn: any) => { //1
   let cache: any = {}; // 2
   return (...args: any[]) => { //3
      let stringifiedArgs = JSON.stringify(args);//4
      let result = cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args); //5
      return result;//6
   };
};
