import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sid: string;
  iat: number;
  exp: number;
}

export function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.header('Authorization');

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or incorrectly formatted' });
  }

  const token = auth.slice(7);
    if (!token) {
        return res.status(401).json({ error: 'No token provided or incorrectly formatted' });
    }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
   
    req.sessionId = payload.sid;
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
