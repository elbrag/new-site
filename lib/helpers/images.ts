export const preloadImage = (url: string) => {
	const img = new Image();
	img.src = url;
};

export const makeMemoryImgUrl = (path: string) => {
	return `/static/images/memory/${path}.webp`;
};
