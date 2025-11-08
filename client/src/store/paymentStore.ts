import { create } from 'zustand';
import { toast } from 'react-toastify';
import { createOrder, validateOrder } from '@/api/payment';
import type {
	planTypes,
	Paymentresponse,
	validationParams,
} from '@/types/paymentTypes';

type PaymentState = {
	selectedPlan: planTypes | null;
	order: Paymentresponse['order'] | null;
	credits: number | null;
	loading: boolean;
	success: boolean;
	message: string | null;

	setPlan: (plan: planTypes) => void;
	initiatePayment: (plan: planTypes) => Promise<void>;
	verifyPayment: (params: validationParams) => Promise<void>;
	resetPayment: () => void;
};

export const usePaymentStore = create<PaymentState>((set) => ({
	selectedPlan: null,
	order: null,
	credits: null,
	loading: false,
	success: false,
	message: null,

	setPlan: (plan) => set({ selectedPlan: plan }),

	initiatePayment: async (plan) => {
		try {
			set({ loading: true, message: null });
			const res = await createOrder(plan);
			set({
				order: res.order,
				credits: res.credits,
				success: res.success,
				message: res.message,
			});
			toast.info('Order created — launching Razorpay…');
		} catch (err: any) {
			toast.error(
				err?.response?.data?.message || 'Failed to create order'
			);
			set({ success: false });
		} finally {
			set({ loading: false });
		}
	},

	verifyPayment: async (params) => {
		try {
			set({ loading: true });
			const res = await validateOrder(params);

			toast.success('Payment successful 🎉 Redirecting…');
			set({ message: res.message, success: true });

			setTimeout(() => {
				window.location.href = '/upload';
			}, 1200);
		} catch (err: any) {
			toast.error('Payment verification failed or QR invalid.');
			set({ success: false });
		} finally {
			set({ loading: false });
		}
	},

	resetPayment: () =>
		set({
			order: null,
			credits: null,
			success: false,
			message: null,
			selectedPlan: null,
		}),
}));
