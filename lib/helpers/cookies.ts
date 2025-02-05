/**
 * Cookie names enum
 */
export enum CookieNames {
	FirebaseToken = "firebaseToken",
	IntroShown = "introShown",
}

/**
 * Set cookie
 */
export const setCookie = (name: CookieNames, value: string, days: number) => {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

/**
 * Get cookie
 */
export const getCookie = (name: CookieNames, cookieString: string) => {
	const nameEQ = name + "=";
	const ca = cookieString.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};
