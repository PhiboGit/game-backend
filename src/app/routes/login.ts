import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginUserSchema } from '../validation/authValidation';
import { validateData } from '../middleware/validationMiddleware';
import User from '../models/user';

const router = express.Router();

router.post('/', validateData(loginUserSchema), authUser, createJWT, (req: Request, _res: Response) => {
  console.log('Login successful for user: ', req.body.username);
});

async function authUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).send('Invalid username or password');
      return 
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      res.status(401).send('Invalid username or password');
      return 
    }
    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send();
  }
}

async function createJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = { username: req.body.username, character: req.body.character}
    const SECRET = process.env.ACCESS_TOKEN_SECRET as jwt.Secret
    const options = {
        expiresIn: '14y'
    }
    const token = jwt.sign(payload, SECRET, options)
    res.status(201).send({ token });
    next()
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send();
  }
}


export default router