// app/api/route.js

import { ChromaClient } from 'chromadb';
import { TransformersEmbeddingFunction } from 'chromadb';
import { encode } from 'gpt-tokenizer';
import OpenAI from 'openai';

const client = new ChromaClient({ path: "http://34.135.31.176:8000" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const embedder = new TransformersEmbeddingFunction({ openai_api_key: process.env.OPENAI_API_KEY });
let collection;

const initializeCollection = async () => {
    try {
        collection = await client.getCollection({ name: "assistant_collection_oai69", embeddingFunction: embedder });
    } catch (error) {
        console.error("Error initializing collection:", error);
    }
};
initializeCollection();

const queryCollection = async (query) => {
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

const filterQueryResults = (results, maxPromptLength = 3900) => {
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

const buildPrompt = (query, contexts) => {
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

const getChatGPTResponse = async (query, contexts) => {
    const messages = buildPrompt(query, contexts);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error getting GPT response:", error);
        throw error;
    }
};

export default async (req, res) => {
    await initializeCollection();

    if (req.method === 'POST') {
        const { query } = req.body;

        try {
            const nestedDocuments = await queryCollection(query);
            const documents = nestedDocuments.flat();
            const { contexts } = filterQueryResults({ documents: [documents] });
            const gptResponse = await getChatGPTResponse(query, contexts);
            res.status(200).json({ response: gptResponse });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
