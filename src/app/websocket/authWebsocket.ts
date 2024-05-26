import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

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
    const token = getTokenFromRequest(request);
    if (!token) {
      return reject(new Error('No token provided'));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(new Error('Failed to authenticate token'));
      }
      // Ensure the decoded token is of type JwtPayload
      const payload = decoded as JwtPayload;
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