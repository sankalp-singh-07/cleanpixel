import express from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import {
	createOrderController,
	creditsController,
	verifyOrderController,
} from '../controllers/paymentController';

const paymentRoute = express.Router();

paymentRoute.get('/credits', verifyAccessTokenMiddleware, creditsController);

paymentRoute.post(
	'/create-order',
	verifyAccessTokenMiddleware,
	createOrderController
);

paymentRoute.post(
	'/verify-order',
	verifyAccessTokenMiddleware,
	verifyOrderController
);

export default paymentRoute;
