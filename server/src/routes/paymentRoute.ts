import express, { Request, Response } from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { validateId } from '../utils/validateId';
import { addCredits, getCredits } from '../lib/prisma';
import { CURRENCY, RAZORPAY_KEY_SECRET } from '../utils/keys';
import { razorpayInstance } from '../utils/razorpay';
import crypto from 'crypto';
import { PACKAGE_KEY, PACKAGE_MAP } from '../utils/package';

const paymentRoute = express.Router();

paymentRoute.get(
	'/credits',
	verifyAccessTokenMiddleware,
	async (req: Request, res: Response) => {
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
	}
);

paymentRoute.post(
	'/create-order',
	verifyAccessTokenMiddleware,
	async (req: Request, res: Response) => {
		try {
			const userId = req.userId;
			const { plan } = req.body as { plan?: PACKAGE_KEY };

			if (!userId) {
				return res.status(400).json({ message: 'No user found' });
			}

			if (!validateId(userId)) {
				return res.status(400).json({ message: 'Wrong id' });
			}

			if (!plan || !(plan in PACKAGE_MAP)) {
				return res.status(400).json({ error: 'Invalid plan' });
			}

			const { amount, credits, name } = PACKAGE_MAP[plan];

			const options = {
				amount: amount * 100,
				currency: CURRENCY,
				receipt: `${userId}-${plan}-${Date.now()}`,
			};

			const order = await razorpayInstance.orders.create(options);

			console.log(
				`Order created: ${order.id} | Plan: ${name} | User: ${userId}`
			);

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
	}
);

paymentRoute.post(
	'/verify-order',
	verifyAccessTokenMiddleware,
	async (req: Request, res: Response) => {
		try {
			const {
				razorpay_order_id,
				razorpay_payment_id,
				razorpay_signature,
			} = req.body;

			const userId = req.userId;

			if (!userId) {
				return res.status(400).json({ message: 'No user found' });
			}

			if (!validateId(userId)) {
				return res.status(400).json({ message: 'Wrong id' });
			}

			const body = `${razorpay_order_id}|${razorpay_payment_id}`;
			const expectedSignature = crypto
				.createHmac('sha256', RAZORPAY_KEY_SECRET)
				.update(body)
				.digest('hex');

			if (expectedSignature !== razorpay_signature) {
				return res.status(400).json({ message: 'Invalid signature' });
			}

			const orderInfo = await razorpayInstance.orders.fetch(
				razorpay_order_id
			);

			if (!orderInfo) {
				return res.status(400).json({ message: 'No orders found' });
			}

			if (orderInfo.status !== 'paid') {
				return res.status(400).json({ message: 'Order not paid yet' });
			}

			const receiptParts = orderInfo.receipt?.split('-');
			if (!receiptParts || receiptParts.length < 2) {
				return res
					.status(400)
					.json({ message: 'Invalid receipt format' });
			}

			const plan = receiptParts[1] as PACKAGE_KEY;

			if (!(plan in PACKAGE_MAP)) {
				return res
					.status(400)
					.json({ message: 'Invalid plan in receipt' });
			}

			const creditsToAdd = PACKAGE_MAP[plan].credits;

			await addCredits(userId, creditsToAdd);

			console.log(
				`Payment verified: ${razorpay_order_id} | User: ${userId} | Plan: ${plan} | Credits: ${creditsToAdd}`
			);

			res.status(200).json({
				message: 'Payment verified & credits added',
				creditsAdded: creditsToAdd,
				plan,
			});
		} catch (error) {
			console.error('Failed to verify Razorpay order:', error);
			res.status(500).json({ message: 'Failed to verify order', error });
		}
	}
);

export default paymentRoute;
