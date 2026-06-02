import express from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import {
	applyBackgroundController,
	listBackgroundsController,
} from '../controllers/backgroundController';

const backgroundRouter = express.Router();

// GET /api/backgrounds - List all preset backgrounds (public)
backgroundRouter.get('/backgrounds', listBackgroundsController);

// POST /api/images/:id/background - Apply background to image (protected)
backgroundRouter.post(
	'/images/:id/background',
	verifyAccessTokenMiddleware,
	applyBackgroundController
);

export default backgroundRouter;
