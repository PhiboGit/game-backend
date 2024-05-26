import express, { Express, Request, Response } from 'express';
import register from './routes/register';
import login from './routes/login';

const app: Express = express();

// Middleware
app.use(express.json());
app.use('/register', register)
app.use('/login', login)

// Test route
app.get('/', (req: Request, res: Response) => {
  console.log(req.headers['user-agent'])
  res.send('Hello World!');
});

export default app