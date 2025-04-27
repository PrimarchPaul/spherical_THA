import e, { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload as JWTVerifyPayLoad, TokenExpiredError} from 'jsonwebtoken';

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

  if(!auth) {
    res.status(400).json({error: 'Missing Authorization header'});
    return;
  }

  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided or incorrectly formatted' });
    return 
  }

  const token = auth.slice(7);
    if (!token) {
      res.status(401).json({ error: 'No token provided or incorrectly formatted' });
      return;
    }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTVerifyPayLoad;
   
    req.sessionId = payload.sid;
    
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {

      try {
        
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken){ 
          throw new Error('No refresh token');
        }

        const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as JWTVerifyPayLoad;

        const newAccessToken = jwt.sign(
          { sid: refreshPayload.sid }, process.env.JWT_SECRET!,{ expiresIn: '15m' });

        res.setHeader('Authorization', 'Bearer ' + newAccessToken);
        req.sessionId = refreshPayload.sid;

        next();
      } catch (refreshErr) {
        console.error('Refresh failed:', refreshErr);
        res.status(401).json({ error: 'Refresh token invalid or expired' });
        return 
      }
    }

    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid access token' });
    return 
  }
}