import { CreateIndexRequestMetricEnum, Pinecone } from '@pinecone-database/pinecone';

import config from '../config/default';
import { PineconeNamespace } from './constant';

const apiKey = config.PINECONE_API_KEY;

let pineconeClient: Pinecone;

export const initPinecone = async () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: apiKey,
    });
  }
};

const checkIfIndexExists = async (indexName: string) => {
  try {
    const response = await pineconeClient.listIndexes();
    return response.indexes?.some((index) => index.name === indexName);
  } catch (error) {
    console.error('Error listing indexes: ', error);
    return false;
  }
};
export const getIndex = async (indexName: string) => {
  try {
    const indexExist = await checkIfIndexExists(indexName);
    if (!indexExist) {
      await createIndex(indexName);
    }
    return pineconeClient.index(indexName);
  } catch (err) {
    console.error('Error creating index:', err);
  }
};

export const createIndex = async (
  indexName: string,
  dimension = 1536,
  metric: CreateIndexRequestMetricEnum = 'cosine',
) => {
  try {
    await pineconeClient.createIndex({
      name: indexName,
      dimension,
      metric,
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });
  } catch (err) {
    console.error('Error creating index:', err);
  }
};

export const storeEmbeddings = async (
  indexName: string,
  id: string,
  embedding: number[],
  namespace: PineconeNamespace,
  metadata?: {},
) => {
  try {
    const index = await getIndex(indexName);
    if (!index) return false;
    const response = await index.namespace(namespace).upsert([
      {
        id: id.toString(),
        values: embedding,
        metadata: metadata || {},
      },
    ]);
    console.log('[storeEmbeddings] response > ', response);
    return true;
  } catch (err) {
    console.error('Error storing embeddings', err);
    return false;
  }
};

export const queryIndex = async (
  indexName: string,
  vector: number[],
  topK: number,
  namespace: PineconeNamespace,
) => {
  try {
    const indexExist = await checkIfIndexExists(indexName);
    if (!indexExist) {
      await createIndex(indexName);
    }
    const index = pineconeClient.index(indexName);
    const response = await index.namespace(namespace).query({
      vector,
      topK,
      includeMetadata: true,
    });

    return response.matches;
  } catch (err) {
    console.error('Error query index:', err);
    return [];
  }
};

export const fetchEmbeddings = async (
  indexName: string,
  namespace: PineconeNamespace,
  id: string,
) => {
  try {
    const indexExist = await checkIfIndexExists(indexName);
    if (!indexExist) {
      await createIndex(indexName);
    }
    const index = pineconeClient.index(indexName);
    const response = await index.namespace(namespace).fetch([id as string]);

    return response.records[id as string].values;
  } catch (err) {
    console.error('Error fetching :', err);
    return [];
  }
};
