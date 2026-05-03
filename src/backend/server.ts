import express from 'express' ;
import cors from 'cors';
import dotenv from 'dotenv';
import { booksRouter} from './routes/books-routes'

dotenv.config();


const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (req, res) => {
  res.json({ message: ' Projet BiblioTech API' });
});

const PORT = process.env.PORT || 3023;

app.use('/api/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


