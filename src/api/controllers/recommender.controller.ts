import { Request, Response } from "express"
import {createEmbeddings} from '../../utils/openAi'
import { getIndex, queryIndex, storeEmbeddings } from "../../utils/pineconeClient";
import { INDEX_NAMES, PineconeNamespace } from "../../utils/constant";
import { createProductEmbeddings, getClosestProducts, handleProductUpsertService, handleUserUpsertService } from "../services/recommender.service";


export const handleProductUpsert = async(req: Request, res: Response) => {
    try {
        const {productId, category, name, description } = req.body;

        const response = await handleProductUpsertService(productId, category, name, description);  
        return res.status(200).json({ message: 'success', response: response });
    }
    catch(error) {
        console.log('handleProductUpsert :: error :: ', error);
        res.status(400).json(error);
    }
}

export const handleUserUpsert = async(req: Request, res: Response) => {
   try {
     const { userId, userInteractions } = req.body;

     const response = await handleUserUpsertService(userId,userInteractions);
     return res.status(200).json({ message: 'success', response: response });
   } catch (error) {
     console.log('handleProductUpsert :: error :: ', error);
     res.status(400).json(error);
   }
}

export const initBulkProductInsert = async(req:Request, res:Response) =>{
    const {products} = req.body;
    try {
        
      for(const product of products){
        const {productId, name, description } = product;
        const embedding = await createEmbeddings(`${name} ${description}`);
        await storeEmbeddings(PineconeNamespace.PRODUCT, productId, embedding, PineconeNamespace.PRODUCT);
      }

      return res.status(200).json({'message':'success'});
    }
    catch(error) {
        console.log('initBulkProductInsert :: error :: ', error);
        return res.status(400).json(error);
    }
}

export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const index = await getIndex(PineconeNamespace.USER);
    if(!index)
        return res.status(400).json({'message':'index not found'})
    const userResponse = await index.namespace(PineconeNamespace.USER).fetch([userId as string]);

    const userEmbedding = userResponse.records[userId as string].values;

    const recommendations = await queryIndex(INDEX_NAMES.DEFAULT, userEmbedding, 10, PineconeNamespace.PRODUCT);
    console.log('userResponse > ', userResponse);
    console.log('userEmbedding > ', userEmbedding);
    console.log('recommendations > ', recommendations);
    const matches = recommendations.map(match => match.id)
    return res.status(200).json({'message':'OK',matches});

  } catch (error) {
    console.log('getRecommendation :: error :: ', error);
    res.status(400).json(error);
  }
};


export const getSingleInteractionRecommendation = async(req:Request,res:Response) => {
  try {
    const {  productId, category, name, description } = req.query;
    const embedding = await createProductEmbeddings(productId as string, category as string, name as string, description as string);
    const closestProduct = await getClosestProducts(embedding, 10);

    return res.status(200).json({message:'success',response:closestProduct});
  }
  catch(error) {
    console.log('getSingleInteractionRecommendation :: error :: ',error);
    res.status(400).json(error);
  }
}