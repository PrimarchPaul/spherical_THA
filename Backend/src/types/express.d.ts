import 'express';

declare module 'express' {
  export interface Request {
    sessionId?: string;
  }
}