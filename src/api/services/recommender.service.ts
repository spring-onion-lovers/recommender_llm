import { INDEX_NAMES, PineconeNamespace } from "../../utils/constant";
import { createEmbeddings } from "../../utils/openAi";
import { getIndex, queryIndex, storeEmbeddings } from "../../utils/pineconeClient";



export const handleProductUpsertService = async (productId: string,category:string, name: string, description: string) => {
    const embedding = await createProductEmbeddings(productId,category, name, description);
    console.log('[handleProductUpsertService][embedding] :', embedding);
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
  userInteractions: {userId: string; interaction: string,productId:string}[],
) => {
    const [embedding,interactions] = await createUserEmbeddings(userId, userInteractions);
    const response = await storeEmbeddings(
      INDEX_NAMES.DEFAULT,
      userId,
      embedding as number[],
      PineconeNamespace.USER,
      { userId, interactions },
    );
    return response;
};

export const getProductEmbeddingsByID = async (productId: string) => {
    const index = await getIndex(INDEX_NAMES.DEFAULT);
    if(!index)  return null;
    const productResponse = await index.namespace(PineconeNamespace.PRODUCT).fetch([productId as string]);

    return productResponse.records[productId as string].values;

}

export const getClosestProducts = async (embedding: number[], topK: number) => {
    const response = await queryIndex(
      INDEX_NAMES.DEFAULT,
      embedding,
      topK,
      PineconeNamespace.PRODUCT
    );
    return response;
}

export const getClosestUsers = async (embedding: number[], topK: number) => {
    const response = await queryIndex(
      INDEX_NAMES.DEFAULT,
      embedding,
      topK,
      PineconeNamespace.USER
    );
    return response;
}

export const createUserEmbeddings = async (
  userId: string,
  userInteractions: { userId: string; interaction: string; productId: string }[],
) => { 
    const interactions = userInteractions.map(
       (row) => `${userId} ${row.interaction} ${row.productId}`,
     );
    const embedding = await createEmbeddings(interactions.join(' '));
    return [embedding,interactions];
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
