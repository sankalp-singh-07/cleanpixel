import { Request, Response } from 'express';
import { validateId } from '../utils/validateId';
import {
	addCredits,
	createOrder,
	findPaymentrecord,
	getCredits,
	updateOrderStatus,
} from '../lib/prisma';
import { CURRENCY, RAZORPAY_KEY_SECRET } from '../utils/keys';
import { razorpayInstance } from '../utils/razorpay';
import crypto from 'crypto';
import { PACKAGE_KEY, PACKAGE_MAP } from '../utils/package';

export const creditsController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;

		if (!userId) {
			return res.status(400).json({ message: 'No user found' });
		}

		if (!validateId(userId))
			return res.status(400).json({ message: 'Wrong id' });

		const credits = await getCredits(userId);

		if (credits === null || credits === undefined) {
			return res
				.status(500)
				.json({ message: 'Failed to get credits count' });
		}

		res.status(200).json({
			message: 'Credits fetched successfully',
			credits,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Failed to get credits', error });
	}
};

export const createOrderController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const { plan } = req.body;

		if (!plan || !(plan in PACKAGE_MAP)) {
			return res.status(400).json({ error: 'Invalid plan' });
		}

		const { amount, credits, name } = PACKAGE_MAP[plan as PACKAGE_KEY];

		if (!userId) {
			return res.status(400).json({ message: 'No user found' });
		}

		if (!validateId(userId)) {
			return res.status(400).json({ message: 'Wrong id' });
		}

		if (!amount || typeof amount !== 'number' || amount <= 0) {
			return res.status(400).json({ message: 'Invalid amount' });
		}

		const options = {
			amount: amount * 100,
			currency: CURRENCY,
			receipt: userId,
		};

		const order = await razorpayInstance.orders.create(options);

		console.log(`Order created: ${order.id} for User: ${userId}`);

		await createOrder(userId, credits, name, amount, order.id);

		res.status(200).json({
			message: 'Order created successfully',
			success: true,
			order,
			credits,
		});
	} catch (error) {
		console.error('Error creating Razorpay order:', error);
		res.status(500).json({ message: 'Failed to create order', error });
	}
};

export const verifyOrderController = async (req: Request, res: Response) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const userId = req.userId;

		if (!userId) return res.status(400).json({ message: 'No user found' });
		if (!validateId(userId))
			return res.status(400).json({ message: 'Wrong id' });

		const body = `${razorpay_order_id}|${razorpay_payment_id}`;
		const expectedSignature = crypto
			.createHmac('sha256', RAZORPAY_KEY_SECRET)
			.update(body)
			.digest('hex');

		if (expectedSignature !== razorpay_signature) {
			return res.status(400).json({ message: 'Invalid signature' });
		}

		const paymentRecord = await findPaymentrecord(
			razorpay_order_id,
			userId
		);
		if (!paymentRecord) {
			return res
				.status(404)
				.json({ message: 'Payment record not found' });
		}

		const orderInfo = await razorpayInstance.orders.fetch(
			razorpay_order_id
		);
		if (!orderInfo || orderInfo.status !== 'paid') {
			return res.status(400).json({ message: 'Order not paid yet' });
		}

		await updateOrderStatus(razorpay_order_id);

		await addCredits(userId, paymentRecord.credits);

		console.log(
			`Payment verified: ${razorpay_order_id} | User: ${userId} | Credits: ${paymentRecord.credits}`
		);

		res.status(200).json({
			message: 'Payment verified & credits added',
			creditsAdded: paymentRecord.credits,
			plan: paymentRecord.plan,
		});
	} catch (error) {
		console.error('Failed to verify Razorpay order:', error);
		res.status(500).json({ message: 'Failed to verify order', error });
	}
};
