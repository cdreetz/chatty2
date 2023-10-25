import React from 'react';
import { useChatContext } from './chatBox';

export default function SendButton() {
    const { handleSubmit } = useChatContext();

    return (
        <button 
            type="submit"
            onClick={(e) => {
                e.preventDefault(); 
                handleSubmit(e);
            }}
            className="px-4 py-1 m-1.5 ml-1 bg-blue-600 text-white border-0 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
            Send
        </button>
    );
}
