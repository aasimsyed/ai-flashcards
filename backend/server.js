import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import flashcardsController from './routes/flashcardController.js';

import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use('/api', flashcardsController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));