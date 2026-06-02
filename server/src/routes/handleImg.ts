import express from 'express';
import { upload } from '../middlewares/multer';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import {
	galleryController,
	removeImageController,
	toggleImageVisibilityController,
	uploadImageController,
} from '../controllers/handleImgController';
const handleImg = express.Router();

handleImg.post(
	'/upload',
	verifyAccessTokenMiddleware,
	upload.single('image'),
	uploadImageController
);

handleImg.post(
	'/remove-bg/:id',
	verifyAccessTokenMiddleware,
	removeImageController
);

handleImg.get('/gallery', verifyAccessTokenMiddleware, galleryController);

// PATCH /api/images/:id/visibility - Toggle image public/private visibility
handleImg.patch(
	'/images/:id/visibility',
	verifyAccessTokenMiddleware,
	toggleImageVisibilityController
);

export default handleImg;
