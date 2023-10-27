// ./app/api/chat/route.js
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { queryCollection, buildPrompt, filterQueryResults } from '../dbUtils';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


export const runtime = 'edge';

export async function POST(req) {
    const { messages } = await req.json();

    const userMessage = messages[messages.length - 1].content;
    console.log('User message:', userMessage);
    const nestedDocuments = await queryCollection(userMessage);
    const documents = nestedDocuments.flat();
    const { contexts } = filterQueryResults({ documents: [documents] });

    const newMessages = buildPrompt(userMessage, contexts)

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        stream: true,
        messages: newMessages,  
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}
