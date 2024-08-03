/*
   Generate random Guid (typeof string).
   Ej: 1866ee32-f154-3692-6349-8b091dd1a474

*/
export const randomGuid = (): string => {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
};

/*
   Generate random string, 8 length min from security.

   let values = {}, i = 0, duplicateCount = 0, val;

   while (i < 1000000) {
	  val = Array(8).fill(0).map(x =>(~~(Math.random()*36)).toString(36)).join('');
	  if (values[val])duplicateCount++;
	  values[val] = 1; i++;
   }
   console.log("TOTAL DUPLICATES", duplicateCount);

*/
export const randomString = (length: number = 8): string =>
	Array(length).fill(0).map(x => (~~(Math.random() * 36)).toString(36)).join('');

/*
   Generate random number.

   let values = {}, i = 0, duplicateCount = 0, val;
   while (i < 1000000) {
	  val = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	  if (values[val])duplicateCount++;
	  values[val] = 1; i++;
   }
   console.log("TOTAL DUPLICATES", duplicateCount);

*/
export const randomInt = (): number =>
	Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1));


/*
   Generate random hexadecimal color.
*/
export const randomColor = (): string => {
	const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

	let hexColorRep = "#"

	for (let index = 0; index < 6; index++) {
		const randomPosition = Math.floor(Math.random() * hexCharacters.length)
		hexColorRep += hexCharacters[randomPosition]
	}

	return hexColorRep;
};

export const randomCustomColor = (colors = ["green", "blue", "red", "yellow", "cyan", "orange", "magenta"]): string => {
	return colors[Math.floor(Math.random() * colors.length)];
};
