import express, { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getRecommendation, getRecommendationViaInteraction, getSimilarProductRecommendation, handleProductUpsert, handleQuery, handleUserUpsert, initBulkProductInsert } from '../controllers/recommender.controller';

const router = express.Router();

router.post('/product', handleProductUpsert);
router.post('/bulkProduct', initBulkProductInsert);
router.post('/user',handleUserUpsert);
router.get('/query', handleQuery);
router.get('/recommend', getRecommendationViaInteraction);
router.get('/recommend-similar-product', getSimilarProductRecommendation)


export default router;