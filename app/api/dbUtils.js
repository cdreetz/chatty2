// app/api/route.js
import { ChromaClient } from 'chromadb';
import { TransformersEmbeddingFunction } from 'chromadb';
import { encode } from 'gpt-tokenizer';

const client = new ChromaClient({ path: "http://34.135.31.176:8000" });
const embedder = new TransformersEmbeddingFunction({ openai_api_key: process.env.OPENAI_API_KEY });

let collection;

export const initializeCollection = async () => {
    console.log("Initializing collection...");
    try {
        collection = await client.getCollection({ name: "assistant_collection_oai69", embeddingFunction: embedder });
        console.log("Collection initialized successfuly:", collection);
    } catch (error) {
        console.error("Error initializing collection:", error);
    }
};
await initializeCollection();

export const queryCollection = async (query) => {
    console.log('Query sent to ChromaDB:', query);
    try {
        const results = await collection.query({
            nResults: 2,
            queryTexts: [query],
            include: ["documents", "metadatas"],
        });
        return results.documents;
    } catch (error) {
        console.error("Error querying collection:", error);
        throw error;
    }
};

export const filterQueryResults = (results, maxPromptLength = 3900) => {
    if (!results || !Array.isArray(results.documents) || results.documents.length === 0) {
        console.error('Results do not have the expected structure:', results);
        return { contexts: [] };
    }

    const contexts = [];
    let total = 0;
    const documents = results.documents[0];

    for (let i = 0; i < documents.length; i++) {
        const document = documents[i];
        const tokenCount = encode(document).length;
        total += tokenCount;

        if (total <= maxPromptLength) {
            contexts.push(document);
        } else {
            break;
        }
    }

    return { contexts };
};

export const buildPrompt = (query, contexts) => {
    const system = {
        role: 'system',
        content: 'You are to play the part of a personal assistant...'
    };
    const user = {
        role: 'user',
        content: `The question is ${query}. Here is all the context you have: ${contexts.join(' ')}`
    };
    return [system, user];
};


