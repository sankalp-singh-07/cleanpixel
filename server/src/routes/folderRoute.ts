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

export default folderRouter;
