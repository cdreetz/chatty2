## Intro

[Demo](https://chatty2-delta.vercel.app/)

Chatty will eventually be a modular chat UI that has easy swappable connections with various vector databases for retrieval.  

Experiment and ship AI chat applications as fast as possible without having to spend too much time building the UI.  This is not a safe space for Langchain users.  

## Goal

To finally have an ultra fast solution for iteratively building chat applications and experimenting with different tools, methods, and databases. 

## How To Use (Eventually)

Copy repo, plug in the connector for your db of choice, set your db host/port, set your keys, npm run dev and you should have a full functioning AI app with retrieval over your db.

Choose from a number of premade UI's until you find one you vibe with. Default, iOS messenger style, terminal style, cyberpunk style, uwu/soft style, etc etc



## What's Done?

Not much
- Default UI
- OAI Chat Completions functionality
- Response streaming (so proud of myself for figuring this out)

## TODO

A lot (short term stuff)
- Chroma connector and query function for retrieval

More (long term stuff)
- Pinecone connector
- Supabase connector
- HuggingFace models functionality



## File Guide
- app/ - we use the Next.js app router thing because a lot of new AI tooling is built on top of it from the Vercel guys
- app/page.js - the home page, since the point of this is just for the chat functionality we only have a single page
- app/api/ - the folder that holds routing files
- app/api/chat/route.js - route file that handles chat messages as well as sends prompts to the OAI API and then handles the response and allows for response streaming
- components/ - component folder
- components/chatBox.js - the larger component that pieces together the messages, input, and button components
- components/inputBox.js - the component that makes up the input, where users type in their prompt
- components/messagesBox.js - the component that makes up the messages history including user messages and AI responses
- components/sendButton.js - the component that when clicked sends the text within the inputbox
