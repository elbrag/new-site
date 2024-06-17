export const kebabToCamel = (text: string): string => {
	return text[0].toUpperCase() + kebabToPascal(text.slice(1, text.length));
};

export const kebabToPascal = (text: string): string => {
	return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const getEnumValue = (enumObject: any, value: string): any => {
	const enumValues = Object.values(enumObject);
	return enumValues.includes(value) ? value : undefined;
};
