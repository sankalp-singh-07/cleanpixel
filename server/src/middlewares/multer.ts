import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../utils/keys';

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => ({
		folder: 'cleanpixel_uploads',
		allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
		public_id: `${Date.now()}-${file.originalname}`,
	}),
});

export const upload = multer({ storage });
