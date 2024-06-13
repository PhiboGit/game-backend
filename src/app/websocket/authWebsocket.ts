import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types.js';
import User from '../models/user.js';
import Character from '../../game/models/character/character.js';

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret

/**
 * Verifies the JWT token in the request.
 * Could also be used to verify a ban.
 * 
 * @param request with the token in the header
 * @returns the decoded token
 */
export function authenticate(request: IncomingMessage): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    const token = getTokenFromUrl(request);
    if (!token) {
      return reject(new Error('No token provided'));
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return reject(new Error('Failed to authenticate token'));
      }
      // Ensure the decoded token is of type JwtPayload
      const payload = decoded as JwtPayload;
      const { username, characterName } = payload;

      // Perform user and character lookup
      const [user, character] = await Promise.all([
        User.findOne({ username }), // Assuming User model has been defined
        Character.findOne({ characterName }) // Assuming Character model has been defined
      ]);

      if (!user || !character) {
        return reject(new Error('User or character not found!'));
      }

      // Attach the decoded token to the promise
      resolve(payload);
    });
  });
}

function getTokenFromRequest(request: IncomingMessage): string | null {
  const authHeader = request.headers['authorization'];
  if (authHeader) {
    const token = authHeader
    return token
  }
  return null;
}

function getTokenFromUrl(request: IncomingMessage): string | null {
  const url = new URL(request.url as string, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');
  if (token) {
    return token
  }
  return null;
}