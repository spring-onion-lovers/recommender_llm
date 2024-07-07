import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT ?? '',
  PINECONE_API_KEY: process.env.PINECONE_API_KEY ?? '',
  OPEN_API_KEY: process.env.OPEN_API_KEY ?? '',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? '',
};