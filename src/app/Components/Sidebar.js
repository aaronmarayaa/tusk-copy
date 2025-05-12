import { useState, useRef, useEffect } from 'react';

export default function Sidebar({ chats, setChatHistory, setCurrentTitle, deleteChat, isSidebarOpen, startNewChatSession, setIsSidebarOpen }) {
    const dropdownRef = useRef(null);

    return (
        <aside className={`h-full relative self-start flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-74' : 'w-0 p-0'}`}>
            <div className='w-50 flex gap-4'>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-xs w-9 h-7 text-white hover:text-red-400 mb-4"
                >
                    <img src={'/closeSidebar.png'} className='w-7 h-full'/>
                </button>
                <button onClick={startNewChatSession} className="text-sm h-9 flex w-full justify-center">
                    <img src={'/images/chat.png'} className='w-7 h-7'/>
                </button>
            </div>
            {chats.map((session, index) => (
                <div key={index} className="relative flex items-center w-full">
                <span
                    className="my-1 cursor-pointer w-50 hover:bg-gray-800 rounded"
                    onClick={() => {
                    setChatHistory(chats[index]);
                    setCurrentTitle(session[0]?.title || `No title`);
                    }}
                >
                    {session[0]?.title && (
                        <p className="truncate text-sm p-2">{session[0].title}</p>
                        )}
                </span>

                <div className="relative ml-2">
                    <button onClick={() =>deleteChat(index)} className="text-white text-xl">
                        {session[0]?.title && ( <img src={'/images/bin.png'} className='w-4 cursor-pointer'/> )}
                    </button>
                </div>
                </div>
            ))}
        </aside>
    );
}
