'use client'

import React from 'react';
import ChatBox from '/components/chatBox';

export const runtime = 'edge';

export default function ChatPage() {
    return (
      <div className="flex justify-center items-center h-screen bg-white rounded">
            <ChatBox />
        </div>
    );
}
