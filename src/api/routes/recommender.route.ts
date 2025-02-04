import express, { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import {  getRecommendationViaInteraction, getSimilarProductRecommendation, handleProductUpsert, handleQuery, handleUserInteractionUpsert, handleUserUpsert, initBulkProductInsert } from '../controllers/recommender.controller';

const router = express.Router();

router.post('/product', handleProductUpsert);
router.post('/bulkProduct', initBulkProductInsert);
router.post('/user',handleUserUpsert);
router.get('/query', handleQuery);
router.post('/interaction', handleUserInteractionUpsert);
router.get('/recommend', getRecommendationViaInteraction);
router.get('/recommend-similar-product', getSimilarProductRecommendation)


export default router;