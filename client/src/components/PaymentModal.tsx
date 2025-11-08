import { useEffect } from 'react';
import { usePaymentStore } from '@/store/paymentStore';
import { toast } from 'react-toastify';
import type { validationParams } from '@/types/paymentTypes';

declare global {
	interface Window {
		Razorpay: any;
	}
}

export const PaymentModal = () => {
	const { order, verifyPayment } = usePaymentStore();

	useEffect(() => {
		if (!order) return;

		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID,
			amount: order.amount,
			currency: order.currency,
			name: 'CleanPixel',
			description: 'Purchase Credits',
			order_id: order.id,
			handler: async (response: validationParams) => {
				await verifyPayment(response);
			},
			modal: {
				ondismiss: () => toast.warn('Payment cancelled'),
			},
			theme: { color: 'var(--primary)' },
		};

		try {
			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (err) {
			toast.error(
				"Payment window could not open. If you see 'Invalid QR', please retry or use another UPI app."
			);
		}
	}, [order]);

	return null;
};
