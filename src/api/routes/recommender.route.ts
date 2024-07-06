import express, { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getRecommendation, getSingleInteractionRecommendation, handleProductUpsert, initBulkProductInsert } from '../controllers/recommender.controller';

const router = express.Router();

router.post('/product', handleProductUpsert);
router.post('/bulkProduct', initBulkProductInsert);
router.get('/recommend', getRecommendation)
router.get('/recommend-interaction', getSingleInteractionRecommendation)


export default router;