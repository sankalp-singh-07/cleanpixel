import express from 'express';
import { sendContactMessage, subscribeNewsletter } from '../controllers/contactController.js';

const contactRoute = express.Router();

contactRoute.post('/contact', sendContactMessage);
contactRoute.post('/subscribe', subscribeNewsletter);

export default contactRoute;
