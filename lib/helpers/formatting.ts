export const kebabToCamel = (text: string): string => {
	return text[0].toUpperCase() + kebabToPascal(text.slice(1, text.length));
};

export const kebabToPascal = (text: string): string => {
	return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const getEnumValue = <T extends Record<string, string | number>>(
	enumObject: T,
	value: string
): T[keyof T] | undefined => {
	const enumValues = Object.values(enumObject) as (string | number)[];
	return enumValues.includes(value as T[keyof T])
		? (value as T[keyof T])
		: undefined;
};
