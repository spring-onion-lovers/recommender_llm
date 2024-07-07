import { Request, Response } from 'express';
import { createEmbeddings, processUserQuery } from '../../utils/openAi';
import { fetchEmbeddings, getIndex, queryIndex, storeEmbeddings } from '../../utils/pineconeClient';
import { INDEX_NAMES, PineconeNamespace } from '../../utils/constant';
import {
  createProductEmbeddings,
  getClosestProducts,
  handleProductUpsertService,
  handleUserInteractionUpsertService,
  handleUserUpsertService,
} from '../services/recommender.service';
import { identifyRecommendations, parseUserActions } from '../helper/helper';
import { RecordMetadata, ScoredPineconeRecord } from '@pinecone-database/pinecone';

export const handleProductUpsert = async (req: Request, res: Response) => {
  try {
    const { productId, category, name, description } = req.body;

  if (!productId || !category || !name || !description) 
      return res.status(400).json({ message: 'Product property is required' });
    
    const response = await handleProductUpsertService(
      productId as string,
      category,
      name,
      description,
    );
    console.log(response);
    return res.status(200).json({ message: 'success', response: response });
  } catch (error) {
    console.log('handleProductUpsert :: error :: ', error);
    res.status(400).json(error);
  }
};
export const handleUserInteractionUpsert = async(req:Request, res:Response) =>{
  try {
    const { userId, interaction,productId } = req.body;

    if (!userId || !interaction || !productId)
      return res.status(400).json({ message: 'Interactions property is required' });
    const response = await handleUserInteractionUpsertService(userId as string, interaction, productId as string);

    return res.status(200).json({ message: 'success', response: response });
  } catch (error) {
    console.log('handleUserInteractionUpsert :: error :: ', error);
    res.status(400).json(error);
  }
}
export const handleUserUpsert = async (req: Request, res: Response) => {
  try {
    const { userId, userInteractions } = req.body;

     if (!userId || !userInteractions) 
      return res.status(400).json({ message: 'User ID or userInteractions is required' });
    const response = await handleUserUpsertService(userId, userInteractions);
    return res.status(200).json({ message: 'success', response: response });
  } catch (error) {
    console.log('handleProductUpsert :: error :: ', error);
    res.status(400).json(error);
  }
};

export const initBulkProductInsert = async (req: Request, res: Response) => {
  const { products } = req.body;
  
     if (!products) 
      return res.status(400).json({ message: 'Products is required' });
  try {
    for (const product of products) {
      const { productId, name, description, category } = product;
      const response = await handleProductUpsertService(
        productId as string,
        category,
        name,
        description,
      );

      console.log('[initBulkProductInsert] :response: ', response);
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log('initBulkProductInsert :: error :: ', error);
    return res.status(400).json(error);
  }
};

export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

     if (!userId) 
      return res.status(400).json({ message: 'User ID is required' });
    const index = await getIndex(INDEX_NAMES.DEFAULT);
    if (!index) return res.status(400).json({ message: 'index not found' });
    const userResponse = await index.namespace(PineconeNamespace.USER).fetch([userId as string]);

    const userEmbedding = userResponse.records[userId as string].values;

    const recommendations = await queryIndex(
      INDEX_NAMES.DEFAULT,
      userEmbedding,
      10,
      PineconeNamespace.PRODUCT,
    );
    const matches = recommendations.map((match) => match.id);
    return res.status(200).json({ message: 'OK', productIds: matches });
  } catch (error) {
    console.log('getRecommendation :: error :: ', error);
    res.status(400).json(error);
  }
};

export const getRecommendationViaInteraction = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

     if (!userId) 
      return res.status(400).json({ message: 'User ID is required' });
    const index = await getIndex(INDEX_NAMES.DEFAULT);
    if (!index) return res.status(400).json({ message: 'index not found' });

    const userEmbedding = await fetchEmbeddings(
      INDEX_NAMES.DEFAULT,
      PineconeNamespace.USER,
      userId as string,
    );

    const nearestUsers: ScoredPineconeRecord<RecordMetadata>[] = await queryIndex(
      INDEX_NAMES.DEFAULT,
      userEmbedding,
      5,
      PineconeNamespace.USER,
    );

    const interactions = nearestUsers.flatMap(
      (item: ScoredPineconeRecord<RecordMetadata>) => item?.metadata?.interactions,
    );

    const userActions = parseUserActions(interactions);

    const recommendations = identifyRecommendations(parseInt(userId as string), userActions);
    return res.status(200).json({ message: 'success', response: recommendations });
  } catch (error) {
    console.log('getRecommendationViaInteraction :: error :: ', error);
    res.status(400).json(error);
  }
};

export const getSimilarProductRecommendation = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
     if (!productId) 
      return res.status(400).json({ message: 'Product ID is required' });
    const index = await getIndex(INDEX_NAMES.DEFAULT);
    if (!index) return res.status(400).json({ message: 'index not found' });

    const productEmbedding = await fetchEmbeddings(
      INDEX_NAMES.DEFAULT,
      PineconeNamespace.PRODUCT,
      productId as string,
    );

    const closestProduct = await getClosestProducts(productEmbedding, 10);
    const matches = closestProduct.map((match) => match.id);

    return res.status(200).json({ message: 'success', response: matches });
  } catch (error) {
    console.log('getSingleInteractionRecommendation :: error :: ', error);
    res.status(400).json(error);
  }
};


export const handleQuery = async(req:Request, res:Response) =>{
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    console.log('query) : ', query);
    const searchCriteria = await processUserQuery(query as string);
    console.log('searchCriteria : ', searchCriteria);
    const searchEmbedding = await createEmbeddings(searchCriteria);

    // Query Pinecone
    const products = await getClosestProducts(searchEmbedding, 10);

    console.log('products : ',products)
    const matches = products.map((match) => match.id);
    return res.status(200).json({ message: 'OK', productIds: matches });
  } catch (error) {
    console.log('handleQuery :: error :: ', error);
    res.status(400).json(error);
  }
}