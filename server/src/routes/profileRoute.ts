import express from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import {
	getProfile,
	updateProfile,
	getPublicProfile,
	uploadAvatar,
} from '../controllers/profileController';
import { upload } from '../middlewares/multer';

const profileRouter = express.Router();

profileRouter.get('/users/:username', getPublicProfile);

profileRouter.get('/profile', verifyAccessTokenMiddleware, getProfile);

profileRouter.patch(
	'/updateProfile',
	verifyAccessTokenMiddleware,
	updateProfile
);

profileRouter.patch(
	'/profile/avatar',
	verifyAccessTokenMiddleware,
	upload.single('avatar'),
	uploadAvatar
);

export default profileRouter;
