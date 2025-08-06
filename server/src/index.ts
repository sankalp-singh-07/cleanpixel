import express from 'express';
import authRoute from './routes/authRoute.js';
import imgUpload from './routes/uploadImageRoute.js';

const app = express();
app.use(express.json());

const PORT = 3000;

app.use('/api', authRoute);
app.use('/api', imgUpload);

app.get('/', (req, res) => {
	res.send('Hello World my name is Sankalp');
});

app.listen(PORT, () => console.log('Server started'));
