import OpenAI from 'openai';
import config from '../config/default';

const apiKey = config.OPEN_API_KEY;

let openAi: OpenAI;
const getOpenAI = () => {
  if (!openAi) {
    openAi = new OpenAI({
      apiKey: apiKey,
    });
  }

  return openAi;
};
export const createEmbeddings = async(text: string) =>{
  const openAi = getOpenAI();
  const embedding = await openAi.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  console.log('[createEmbedding][embedding] :', embedding);
  return embedding.data[0].embedding;
}
