import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginUserSchema } from './authValidation.js';
import { validateData } from '../middleware/validationMiddleware.js';
import User from '../models/user.js';
import { JwtPayload } from '../types.js';

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
    // attach characterName of the user to the request to be used be the next middleware
    req.body.characterName = user.characterName

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
    const payload: JwtPayload = { username: req.body.username, characterName: req.body.characterName}
    const SECRET = process.env.JWT_SECRET as jwt.Secret
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