import express from 'express';
import authRoute from './routes/authRoute.js';
import handleImg from './routes/handleImg.js';
import paymentRoute from './routes/paymentRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;

app.set('trust proxy', 1);

app.use(
	cors({
		origin: ['https://your-frontend.com', 'http://localhost:5173'],
		credentials: true,
	})
);

app.use('/api', authRoute);
app.use('/api', handleImg);
app.use('/api', paymentRoute);

app.get('/', (req, res) => {
	res.send('Hello World my name is Sankalp');
});

app.listen(PORT, () => console.log('Server started'));
