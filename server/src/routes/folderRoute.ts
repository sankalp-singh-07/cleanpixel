import express from 'express';
import * as folderCtrl from '../controllers/folderController';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';

const folderRouter = express.Router();

folderRouter.get(
	'/profile/:username/folder/:folderId',
	folderCtrl.getPublicFolderController
);

folderRouter.post(
	'/folders',
	verifyAccessTokenMiddleware,
	folderCtrl.createFolderController
);
folderRouter.get(
	'/folders',
	verifyAccessTokenMiddleware,
	folderCtrl.listUserFoldersController
);

// Static routes must come before parameterized routes
folderRouter.post(
	'/folders/assign-image',
	verifyAccessTokenMiddleware,
	folderCtrl.assignImageController
);
folderRouter.patch(
	'/folders/remove-image/:imageId',
	verifyAccessTokenMiddleware,
	folderCtrl.removeImageController
);

// Parameterized folder routes
folderRouter.get(
	'/folders/:folderId',
	verifyAccessTokenMiddleware,
	folderCtrl.getFolderController
);
folderRouter.patch(
	'/folders/:folderId',
	verifyAccessTokenMiddleware,
	folderCtrl.updateFolderController
);
folderRouter.delete(
	'/folders/:folderId',
	verifyAccessTokenMiddleware,
	folderCtrl.deleteFolderController
);

export default folderRouter;
