import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import recommendRouter from './api/routes/recommender.route'

const router = express.Router();


router.get('/health', (res:Response,req:Request)=> {
     return res.status(200).json({
       message: 'Health OK',
     });
})

router.use('/v1',recommendRouter)

export default router;