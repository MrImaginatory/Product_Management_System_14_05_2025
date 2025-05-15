import express from 'express';
import cors from 'cors'
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import path from 'path'
const __dirname = import.meta.dirname


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', categoryRouter);
app.use('/api', productRouter);

export { app };
