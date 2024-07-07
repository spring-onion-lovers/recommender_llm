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
  return embedding.data[0].embedding;
}

export const processUserQuery = async (query:string )=>{
    const openAi = getOpenAI();
    const response = await openAi.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: query,
        max_tokens: 128,
        temperature: 0.5
    })
    console.log('[processUserQuery] response > ', response);
    return response.choices[0].text.trim();
}