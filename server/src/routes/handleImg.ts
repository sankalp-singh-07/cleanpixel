import express from 'express';
import { upload } from '../middlewares/multer';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import {
	galleryController,
	removeImageController,
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

export default handleImg;
