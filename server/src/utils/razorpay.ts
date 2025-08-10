import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from './keys';

export const razorpayInstance = new Razorpay({
	key_id: RAZORPAY_KEY_ID,
	key_secret: RAZORPAY_KEY_SECRET,
});
