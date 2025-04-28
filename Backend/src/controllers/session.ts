import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const initSession: RequestHandler = (_req, res) => {
  const sid = uuidv4();

  const secret = process.env.JWT_SECRET!;
  const refreshSecret = process.env.REFRESH_SECRET!;

  if (!secret) throw new Error('Missing JWT_SECRET');

  const token = jwt.sign({ sid }, secret, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sid }, refreshSecret,{ expiresIn: '7d' });

  res.setHeader('Content-Type', 'application/json');
 
  res.json({ token, refreshToken, sessionId: sid });
};