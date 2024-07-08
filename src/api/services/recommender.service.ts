import { INDEX_NAMES, PineconeNamespace } from '../../utils/constant';
import { createEmbeddings } from '../../utils/openAi';
import {
  fetchEmbeddings,
  getIndex,
  getIndexAndNamespace,
  queryIndex,
  storeEmbeddings,
} from '../../utils/pineconeClient';

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
  const [embedding,metadataInteraction] = await createUserEmbeddings(userId, userInteractions);
  const response = await storeEmbeddings(
    INDEX_NAMES.DEFAULT,
    userId,
    embedding as number[],
    PineconeNamespace.USER,
    { userId, metadataInteraction },
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

  const userResponse = await index.namespace(PineconeNamespace.USER).fetch([`${userId}`]);

  if (userResponse && userResponse.records && Object.keys(userResponse.records).length > 0) {
    const userMetadata = userResponse.records[userId as string].metadata;

    const interactions = (userMetadata?.interactions as []) || [];

    const [embedding, metadataInteraction] = await createUserEmbeddings(userId, interactions);

    const response = await index.update({
      id: `${userId}`,
      values: embedding as number[],
      metadata: { interactions: metadataInteraction as string[], userId },
    });
    return true;
  } else {
    const interactions = []
    interactions.push({ userId, interaction, productId });
    const insertNewUserInteractions = await handleUserUpsertService(userId, interactions);
  }
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

export const checkIfUserExists = async (userId: string) => {
  const index = await getIndexAndNamespace(INDEX_NAMES.DEFAULT, PineconeNamespace.USER);
  if (!index) return false;
  const userResponse = await index.fetch([`${userId}`]);

  if (userResponse && userResponse.records && Object.keys(userResponse.records).length > 0) {
    return true;
  }

  return false;
};

export const checkIfProductExists = async (productId: string) => {
  const index = await getIndex(INDEX_NAMES.DEFAULT);
  if (!index) return false;
  const productResponse = await index
    .namespace(PineconeNamespace.PRODUCT)
    .fetch([`${productId}`]);
  if (productResponse && productResponse.records && Object.keys(productResponse.records).length > 0) {
    return true;
  }
  return false;
}

export const createUserEmbeddings = async (
  userId: string,
  userInteractions: { userId: string; interaction: string; productId: string }[],
) => {
  const interactions = userInteractions.map(
    (row) => `User ${userId} ${row.interaction} Product ${row.productId}`,
  );
  const metadataInteraction = userInteractions.map(
    (row) => `${userId} ${row.interaction} ${row.productId}`,
  );
  const embedding = await createEmbeddings(interactions.join(' '));
  return [embedding, metadataInteraction];
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
