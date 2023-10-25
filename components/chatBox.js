import React, { createContext, useContext }from 'react';
import MessagesBox from './messagesBox';
import InputBox from './inputBox';
import SendButton from './sendButton';
import { useChat } from 'ai/react';

export const ChatContext = createContext();

export function useChatContext() {
    return useContext(ChatContext);
}

export default function ChatBox() {
    const chat = useChat({
        api: '/api/chat',
    });

    return (
        <ChatContext.Provider value={chat}>
            <div className="w-3/4 h-3/4 flex flex-col bg-black rounded-md">
                <MessagesBox />
                <div className="flex items-center">
                    <InputBox />
                    <SendButton />
                </div>
            </div>
        </ChatContext.Provider>
    );
}

