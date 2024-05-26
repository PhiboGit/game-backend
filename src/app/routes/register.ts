import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from '../models/user';
import Character from '../../game/models/character';
import { validateData } from '../middleware/validationMiddleware';

const router = express.Router();

const USER_REGEX = /^[A-z][A-z0-9-_]{1,23}$/;
const CHARACTER_REGEX = /^[A-z][A-z0-9-_]{1,23}$/;
const PWD_REGEX = /^(?=.*[a-z])*(?=.*[A-Z])*(?=.*[0-9])*(?=.*[!@#$%])*.{8,24}$/;

const createUserSchema = z.object({
  username: z.string().regex(USER_REGEX, 'Invalid username'),
  password: z.string().regex(PWD_REGEX, 'Invalid password'),
  characterName: z.string().regex(CHARACTER_REGEX, 'Invalid character name'),
});

router.post('/', validateData(createUserSchema), hashPassword, insertUser, (_req: Request, res: Response) => {
  res.status(201).send('Your account was created successfully');
});

async function hashPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send();
  }
}

async function insertUser(req: Request, res: Response, next: NextFunction) {
  try {

    const responseUser = await User.create({
      characterName: req.body.characterName,
      username: req.body.username,
      password: req.body.password
    });
    console.log('User created successfully: ', responseUser.username);
    const responseCharacter = await Character.create({
      characterName: req.body.characterName
    });
    console.log('Character created successfully: ', responseCharacter.characterName);
    next();
  } catch (error: any) {
    if (error.code === 11000) {
        console.log('Duplicate key error:', error.message);
        if (error.keyPattern.username) {
          res.status(409).send('Username already exists');
        } else if (error.keyPattern.characterName) {
          res.status(409).send('Character already exists');
        }
      } else {
        console.error('Unexpected error:', error.message);
        res.status(500).send('Internal Server Error');
      }
  }
}

export default router;
