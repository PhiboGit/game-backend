import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import register from './routes/register.js';
import login from './routes/login.js';

const app: Express = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
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

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});


export default app