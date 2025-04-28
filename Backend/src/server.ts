require('module-alias/register');
import 'module-alias/register';
import express, {Express} from 'express';
import dotenv from 'dotenv';
import router from '@routes/index';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
dotenv.config({path: path.join(__dirname, '../.env')})

const server: Express = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'


const raw = process.env.CORS_WHITELIST || '';
const WHITELIST = raw.split(',').map(origin => origin.trim()).filter(Boolean);


server.use(
    cors({
      origin: (incomingOrigin, callback) => {
        
        if (!incomingOrigin) return callback(null, true);
  
        if (WHITELIST.includes(incomingOrigin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS policy: origin "${incomingOrigin}" not allowed`));
      },
      credentials: true,
      allowedHeaders: ['Content-Type','Authorization'],
      methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    })
  )

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())
server.use("/", router)

server.listen(PORT, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
})

