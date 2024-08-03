type Override<T1, T2> = Omit<T1, keyof T2> & T2;

/**
* Obtiene un tipo de Clave-Valor.
* @returns 
* ```typescript
* { Key: number; Value: string; }
* ```
*/
export type KeyValueModel = { 
    Key: number;
    Value: string;
}

/**
* Obtiene un tipo de Clave-Valor.
* @typeParam TKey Clave del tipo `TKey`.
* @returns 
* ```typescript
* { Key: TKey; Value: string; }
* ```
*/
export type TKeyValueModel<TKey> = Override<KeyValueModel, { Key: TKey }>

/**
* Obtiene un tipo de Clave-Valor.
* @typeParam TValue Valor del tipo `TValue`.
* @returns 
* ```typescript
* { Key: number; Value: TValue; }
* ```
*/
export type KeyTValueModel<TValue> = Override<KeyValueModel, { Value: TValue }>

/**
* Obtiene un tipo de Clave-Valor.
* @typeParam TKey Clave del tipo `TKey`.
* @typeParam TValue Valor del tipo `TValue`.
* @returns 
* ```typescript
* { Key: TKey; Value: TValue; }
* ```
*/
export type TKeyTValueModel<TKey, TValue> = Override<KeyValueModel, { Key: TKey, Value: TValue }>
