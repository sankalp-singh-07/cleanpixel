import type { RemoveImgType, UploadImgType } from '@/types/uploadTypes';
import api from '@/api';

export async function uploadImage(
	image: File,
	opts?: { onProgress?: (p: number) => void; signal?: AbortSignal }
) {
	const formData = new FormData();
	formData.append('image', image);
	const { data } = await api.post<UploadImgType>('/upload', formData, {
		signal: opts?.signal,
		onUploadProgress: (evt) => {
			if (!opts?.onProgress || !evt.total) return;
			const p = Math.round((evt.loaded / evt.total) * 100);
			opts.onProgress(p);
		},
		headers: {},
	});

	return data;
}

export async function removeImage(
	imageId: string,
	opts?: { signal?: AbortSignal }
) {
	const { data } = await api.post<RemoveImgType>(
		`/remove-bg/${imageId}`,
		undefined,
		{
			signal: opts?.signal,
		}
	);
	return data;
}
