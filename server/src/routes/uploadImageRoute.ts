import express, { Request, Response } from 'express';
import { upload } from '../middlewares/multer';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
const imgUpload = express.Router();

imgUpload.post(
	'/upload',
	verifyAccessTokenMiddleware,
	upload.single('image'),
	async (req: Request, res: Response) => {
		try {
			if (!req.file) {
				return res.status(400).json({ message: 'No file uploaded' });
			}

			const image = req.file as Express.Multer.File & { path?: string };

			res.status(200).json({
				message: 'Image uploaded successfully',
				imageUrl: image?.path,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Upload failed', error });
		}
	}
);

export default imgUpload;
