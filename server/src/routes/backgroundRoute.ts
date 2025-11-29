import express from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { applyBackgroundController } from '../controllers/backgroundController';

const backgroundRouter = express.Router();

backgroundRouter.post(
	'/images/:id/background',
	verifyAccessTokenMiddleware,
	applyBackgroundController
);

export default backgroundRouter;
