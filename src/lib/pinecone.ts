import { Pinecone } from "@pinecone-database/pinecone";

// Initialize a client
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
