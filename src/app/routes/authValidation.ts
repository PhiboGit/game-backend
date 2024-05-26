import { z } from 'zod';

const USER_REGEX = /^[A-z][A-z0-9-_]{1,23}$/;
const CHARACTER_REGEX = /^[A-z][A-z0-9-_]{1,23}$/;
const PWD_REGEX = /^(?=.*[a-z])*(?=.*[A-Z])*(?=.*[0-9])*(?=.*[!@#$%])*.{8,24}$/;

export const registerUserSchema = z.object({
  username: z.string().regex(USER_REGEX, 'Invalid username'),
  password: z.string().regex(PWD_REGEX, 'Invalid password'),
  characterName: z.string().regex(CHARACTER_REGEX, 'Invalid character name'),
});

export const loginUserSchema = z.object({
  username: z.string().regex(USER_REGEX, 'Invalid username'),
  password: z.string().regex(PWD_REGEX, 'Invalid password'),
});