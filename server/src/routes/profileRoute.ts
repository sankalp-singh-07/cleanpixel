import express from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import {
	getProfile,
	updateProfile,
	getPublicProfile,
} from '../controllers/profileController';

const profileRouter = express.Router();

profileRouter.get('/users/:username', getPublicProfile);

profileRouter.get('/profile', verifyAccessTokenMiddleware, getProfile);

profileRouter.patch(
	'/update-profile',
	verifyAccessTokenMiddleware,
	updateProfile
);

export default profileRouter;
