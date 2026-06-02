import api from '@/api';
import type {
	BackgroundListResponse,
	ApplyBackgroundPayload,
	ApplyBackgroundResponse,
	PresetBackground,
} from '@/types/backgroundTypes';

export async function getBackgrounds(): Promise<PresetBackground[]> {
	const { data } = await api.get<BackgroundListResponse>('/backgrounds');
	return data.data;
}

export async function applyBackground(
	imageId: string,
	payload: ApplyBackgroundPayload
) {
	const { data } = await api.post<ApplyBackgroundResponse>(
		`/images/${imageId}/background`,
		payload
	);
	return data;
}
