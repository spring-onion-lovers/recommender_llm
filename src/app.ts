import express, {Express,Request,Response} from 'express';
import cors from 'cors';
import router from './routes';
import config from './config/default';

const app :Express = express();

const allowedOrigins = config.ALLOWED_ORIGINS

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api',router)


export default app;