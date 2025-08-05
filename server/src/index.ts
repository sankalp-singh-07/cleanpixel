import express from 'express';
import authRoute from './routes/authRoute.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

app.use('/', authRoute);

app.get('/', (req, res) => {
	res.send('Hello World my name is Sankalp');
});

app.listen(PORT, () => console.log('Server started'));
