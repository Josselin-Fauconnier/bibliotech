import express from 'express' ;
import cors from 'cors';
import dotenv from 'dotenv';
import { booksRouter} from './routes/books-routes'
import { authRouter } from './routes/auth-routes'
import { listsRouters } from './routes/lists-routes';
import { commentsRouter } from './routes/comments_routes';
import { adminRouter } from './routes/admin-routes';

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
app.use('/api/lists',listsRouters);
app.use('/api/comments', commentsRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


