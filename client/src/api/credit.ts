import type { CreditsRes } from '@/types/creditsTypes';
import api from '.';

export async function fetchCreditsApi(): Promise<number> {
	const { data } = await api.get<CreditsRes>('/credits');
	return data.credits;
}
