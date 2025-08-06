import express from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
import {
	login,
	logoutController,
	meController,
	refreshController,
	signup,
} from '../controllers/authController.js';
const authRoute = express.Router();

authRoute.post('/login', login);

authRoute.post('/signup', signup);

authRoute.get('/me', verifyAccessTokenMiddleware, meController);

authRoute.get('/refresh', refreshController);

authRoute.post('/logout', logoutController);

export default authRoute;
