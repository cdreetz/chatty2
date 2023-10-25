import React from 'react';
import { useChatContext } from './chatBox';

export default function Inputbox() {
    const { input, handleInputChange } = useChatContext();
    return (
        <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow py-1 m-1.5 mr-1 rounded bg-white text-black focus:outline-none"
        />
    );
}

