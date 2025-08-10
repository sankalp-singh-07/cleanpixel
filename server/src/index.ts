import express from 'express';
import authRoute from './routes/authRoute.js';
import handleImg from './routes/handleImg.js';
import paymentRoute from './routes/paymentRoute.js';
import cors from 'cors';

const app = express();
app.use(express.json());

const PORT = 3000;

const allowedOrigins =
	process.env.NODE_ENV === 'production'
		? ['frontend_domain']
		: ['http://localhost:3000'];

app.use(
	cors({
		origin: allowedOrigins,
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
