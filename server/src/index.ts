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

const allowedOrigins =
	process.env.NODE_ENV === 'production'
		? ['frontend_domain']
		: ['http://localhost:5173'];

const corsOptions: cors.CorsOptions = {
	origin(origin, cb) {
		if (!origin) return cb(null, true);
		if (allowedOrigins.includes(origin)) return cb(null, true);
		cb(new Error('Not allowed by CORS'));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use('/api', authRoute);
app.use('/api', handleImg);
app.use('/api', paymentRoute);

app.get('/', (req, res) => {
	res.send('Hello World my name is Sankalp');
});

app.listen(PORT, () => console.log('Server started'));
