import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { booksRouter } from './routes/books-routes.js';
import { authRouter } from './routes/auth-routes.js';
import { listsRouters } from './routes/lists-routes.js';
import { commentsRouter } from './routes/comments_routes.js';
import { adminRouter } from './routes/admin-routes.js';
import { userRouter } from './routes/user-routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (_req, res) => {
  res.json({ message: ' Projet BiblioTech API' });
});

const PORT = process.env.PORT || 3023;

app.use('/api/books', booksRouter);
app.use('/api/auth', authRouter);
app.use('/api/lists', listsRouters);
app.use('/api/comments', commentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
