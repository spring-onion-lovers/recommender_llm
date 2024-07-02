import express, {Express,Request,Response} from 'express';
import cors from 'cors';

const app :Express = express();


app.use(express.json());
app.use(cors());
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
});



export default app;