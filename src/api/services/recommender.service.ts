import { INDEX_NAMES, PineconeNamespace } from "../../utils/constant";
import { createEmbeddings } from "../../utils/openAi";
import { queryIndex, storeEmbeddings } from "../../utils/pineconeClient";



export const handleProductUpsertService = async (productId: string,category:string, name: string, description: string) => {
    const embedding = await createProductEmbeddings(productId,category, name, description);
    const response = await storeEmbeddings(
      INDEX_NAMES.DEFAULT,
      productId,
      embedding,
      PineconeNamespace.PRODUCT,
      {productId,category,name,description}
    );
    return response;
};


export const handleUserUpsertService = async (
  userId: string,
  userInteractions: {userId: string; interactions: string,productId:string}[],
) => {
    const embedding = await createUserEmbeddings(userId, userInteractions);
    const response = await storeEmbeddings(
      INDEX_NAMES.DEFAULT,
      userId,
      embedding,
      PineconeNamespace.USER,
    );
    return response;
};

export const getClosestProducts = async (embedding: number[], topK: number) => {
    const response = await queryIndex(
      INDEX_NAMES.DEFAULT,
      embedding,
      topK,
      PineconeNamespace.PRODUCT
    );
    return response;
}

export const createUserEmbeddings = async (
  userId: string,
  userInteractions: { userId: string; interactions: string; productId: string }[],
) => { 
    const interactions = userInteractions.map(
       (row) => `${userId} ${row.interactions} ${row.productId}`,
     );
    const embedding = await createEmbeddings(interactions.join(' '));
    return embedding;
};

export const createProductEmbeddings = async (
  productId: string,
  category: string,
  name: string,
  description: string,
) => {
    const embedding = await createEmbeddings(`${name} ${description}`);
    return embedding;
}