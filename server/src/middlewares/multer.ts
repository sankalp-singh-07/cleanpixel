import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../utils/keys';

const allowedMimeTypes = new Set([
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
]);

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => ({
		folder: 'cleanpixel_uploads',
		allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
		public_id: `${Date.now()}-${file.originalname}`,
	}),
});

export const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: (_req, file, cb) => {
		if (allowedMimeTypes.has(file.mimetype)) {
			cb(null, true);
			return;
		}

		cb(new Error('Only JPG, PNG, and WEBP images are supported'));
	},
});
