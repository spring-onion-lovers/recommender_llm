import { INDEX_NAMES, PineconeNamespace } from '../../utils/constant';
import { createEmbeddings } from '../../utils/openAi';
import { fetchEmbeddings, getIndex, getIndexAndNamespace, queryIndex, storeEmbeddings } from '../../utils/pineconeClient';

export const handleProductUpsertService = async (
  productId: string,
  category: string,
  name: string,
  description: string,
) => {
  const embedding = await createProductEmbeddings(productId, category, name, description);
  console.log(`[handleProductUpsertService][productName:${name}][productId:${productId}] `);
  const response = await storeEmbeddings(
    INDEX_NAMES.DEFAULT,
    productId,
    embedding,
    PineconeNamespace.PRODUCT,
    { productId, category, name, description },
  );
  return response;
};

export const handleUserUpsertService = async (
  userId: string,
  userInteractions: { userId: string; interaction: string; productId: string }[],
) => {
  const [embedding, interactions] = await createUserEmbeddings(userId, userInteractions);
  const response = await storeEmbeddings(
    INDEX_NAMES.DEFAULT,
    userId,
    embedding as number[],
    PineconeNamespace.USER,
    { userId, interactions },
  );
  return response;
};

export const handleUserInteractionUpsertService = async (
  userId: string,
  interaction: string,
  productId: string,
) => {
  const index = await getIndexAndNamespace(INDEX_NAMES.DEFAULT, PineconeNamespace.USER);
  if (!index) return null;
  console.log('userId : ', userId);

  console.log('interaction : ', interaction);
  console.log('productId : ', productId);
  const userResponse = await index.namespace(PineconeNamespace.USER).fetch([`${userId}`]);

  
  if (!userResponse) return null;
  const userMetadata = userResponse.records[userId as string].metadata;

  const interactions = userMetadata?.interactions as [] || [];
  const updatedInteractions = [...interactions, `${userId} ${interaction} ${productId}`];

  const updatedEmbeddings = await createEmbeddings(updatedInteractions.join(' '));


  const response = await index
    .update({
        id: `${userId}`,
        values: updatedEmbeddings,
        metadata: { interactions: updatedInteractions, userId },
    });

  return true;
};

export const getClosestProducts = async (embedding: number[], topK: number) => {
  const response = await queryIndex(
    INDEX_NAMES.DEFAULT,
    embedding,
    topK,
    PineconeNamespace.PRODUCT,
  );
  return response;
};

export const getClosestUsers = async (embedding: number[], topK: number) => {
  const response = await queryIndex(INDEX_NAMES.DEFAULT, embedding, topK, PineconeNamespace.USER);
  return response;
};

export const createUserEmbeddings = async (
  userId: string,
  userInteractions: { userId: string; interaction: string; productId: string }[],
) => {
  const interactions = userInteractions.map(
    (row) => `${userId} ${row.interaction} ${row.productId}`,
  );
  const embedding = await createEmbeddings(interactions.join(' '));
  return [embedding, interactions];
};

export const createProductEmbeddings = async (
  productId: string,
  category: string,
  name: string,
  description: string,
) => {
  const embedding = await createEmbeddings(`${name} ${description}`);
  return embedding;
};
