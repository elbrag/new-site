export const kebabToCamel = (kebabCaseString: string): string => {
	return (
		kebabCaseString[0].toUpperCase() +
		kebabCaseString
			.slice(1, kebabCaseString.length)
			.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
	);
};
