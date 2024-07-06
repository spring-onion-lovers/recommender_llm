import { CreateIndexRequestMetricEnum, Pinecone } from '@pinecone-database/pinecone';

import config from '../config/default';
import { PineconeNamespace } from './constant';

const apiKey = config.PINECONE_API_KEY;

let pineconeClient: Pinecone;

const getPineconeClient = () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: apiKey,
    });
  }

  return pineconeClient;
};
const checkIfIndexExists = async (indexName: string) => {
    const client = getPineconeClient();

    try {
        const response = await client.listIndexes();
        return response.indexes?.some(index => index.name === indexName);
    }
    catch(error) {
        console.error('Error listing indexes: ', error);
        return false;
    }
}
export const getIndex = async(indexName:string) => {
    try {
      const client = getPineconeClient();
      const indexExist = await checkIfIndexExists(indexName)
      if (indexExist) {
        return client.index(indexName);
      }
    } catch (err) {
      console.error('Error creating index:', err);
    }
}

export const createIndex = async (
  indexName:string,
  dimension = 1536,
  metric: CreateIndexRequestMetricEnum = 'cosine',
) => {
  try {
    const client = getPineconeClient();
    const indexExist = await checkIfIndexExists(indexName);
    if (!indexExist) {
      await client.createIndex({
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
    }
  } catch (err) {
    console.error('Error creating index:', err);
  }
};

export const storeEmbeddings = async (
  indexName:string,
  id: string,
  embedding: number[],
  namespace: PineconeNamespace,
  metadata?: {}
) => {
  try {
    const client = getPineconeClient();
    const index = client.index(indexName);
    await index.namespace(namespace).upsert([
      {
        id: id,
        values: embedding,
        metadata
      },
    ]);
    return true;
  } catch (err) {
    console.error('Error storing embeddings', err);
    return false;
  }
};


export const queryIndex = async (
    indexName:string,
    vector: number[],
    topK: number,
    namespace:PineconeNamespace
) => {
    try {
        const client = getPineconeClient();
        const index = client.index(indexName);
        const response = await index.namespace(namespace).query({
            vector,
            topK,
        });
        
        return response.matches;
    }catch(err) {
        console.error('Error query index:', err);
        return [];
    }
}
