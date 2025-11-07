export type UploadImgType = {
	message: string;
	imageUrl: string;
	imageId: string;
};

export type RemoveImgType = {
	message: string;
	imageUrl: string;
	imageId: string;
	credits: number;
};

export type ImageItem = {
	id: string;
	userId: string;
	originalUrl: string;
	removedBgUrl?: string | null;
	createdAt: string;
};

export type GalleryResponse = {
	message: string;
	gallery: ImageItem[];
	page: number;
};
