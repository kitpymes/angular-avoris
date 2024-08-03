/**
	* Convierte un string en un valor de tipo TResult.
	* @param {value} value Valor a parsear.
	* @returns Valor de tipo TResult.
	*/
export const tryParseJSON = <TResult>(value: string): TResult => {
	if (!value) {
		throw new Error('Validator.tryParseJSON() "value is null"');
	}

	try {
		const o = JSON.parse(value);

		// Handle non-exception-throwing cases:
		// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		// but... JSON.parse(null) returns null, and typeof null === "object",
		// so we must check for that, too. Thankfully, null is falsey, so this suffices:
		return o ? <TResult>o : <TResult><unknown>null;
	}
	catch (e) {
		return <TResult><unknown>value;
	}
};
