import express, {Express,Request,Response} from 'express';
import cors from 'cors';
import router from './routes';
const app :Express = express();


app.use(express.json());
app.use(cors());

app.use('/api',router)


export default app;