import api from '.';
import type {
	Paymentresponse,
	planTypes,
	validationParams,
} from '@/types/paymentTypes';

export const createOrder = async (
	plan: planTypes
): Promise<Paymentresponse> => {
	const { data } = await api.post<Paymentresponse>('/create-order', { plan });
	return data;
};

export const validateOrder = async (params: validationParams) => {
	const { data } = await api.post('/verify-order', params);
	return data;
};
