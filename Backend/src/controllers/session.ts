import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const initSession: RequestHandler = (_req, res) => {
  const sid = uuidv4();
  
  const token = jwt.sign(
    { sid },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
 
  res.json({ token });
};