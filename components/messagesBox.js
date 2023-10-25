import React, { useEffect, useState } from 'react';
// import { useChat } from 'ai/react';
import { useChatContext } from './chatBox'

export default function MessagesBox() {
    const { messages } = useChatContext();

    return (
        <div className="flex-1 overflow-y-auto p-2.5">
            {messages.map((m) => (
                <div key={m.id} className="py-1 text-white bg-black">
                    {m.role === 'user' ? 'User: ' : 'AI: ' }
                    {m.content}
                </div>
            ))}
        </div>
    );
}

