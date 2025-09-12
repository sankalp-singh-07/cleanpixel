import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export const showToast = (
	message: string,
	kind: ToastKind = 'info',
	opts?: ToastOptions
) => {
	const base: ToastOptions = { autoClose: 3000, ...opts };
	switch (kind) {
		case 'success':
			return toast.success(message, base);
		case 'error':
			return toast.error(message, base);
		case 'warning':
			return toast.warning(message, base);
		default:
			return toast.info(message, base);
	}
};
