import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import register from './routes/register.js';
import login from './routes/login.js';

const app: Express = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5174',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use('/register', register)
app.use('/login', login)

// Test route
app.get('/', (req: Request, res: Response) => {
  console.log(req.headers['user-agent'])
  res.send('Hello World!');
});

export default app