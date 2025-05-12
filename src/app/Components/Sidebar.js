export default function Sidebar({ chats, setChatHistory, deleteChat, isSidebarOpen, startNewChatSession, setIsSidebarOpen }) {

    return (
        <aside className={`h-150 custom-scrollbar relative self-start flex flex-col transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${isSidebarOpen ? 'w-74' : 'w-0 p-0'}`}>
            <div className={`${isSidebarOpen ? 'w-59 gap-4' : 'w-0 gap-0'} transition-all duration-300 ease-in-out h-9 flex fixed bg-black z-1`}>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-xs w-full h-7 text-white hover:text-red-400 mb-4"
                >
                    <img src={'/images/closeSidebar.png'} className='w-7 h-full'/>
                </button>
                <button onClick={startNewChatSession} className="text-sm h-9 flex flex-col w-full">
                    <img src={'/images/chat.png'} className='w-7 h-7 self-end'/>
                </button>
            </div>
            <div className="mt-8">
                {chats.map((session, index) => (
                    <div key={index} className="relative flex items-center w-full">
                        <span
                            className="my-1 cursor-pointer w-50 hover:bg-gray-800 rounded"
                            onClick={() => { setChatHistory(chats[index]); }}
                        >
                            {session[0]?.title && (
                                <p className="truncate text-sm p-2" title={session[0].title}>{session[0].title}</p>
                            )}
                        </span>

                        <div className="relative ml-2">
                            <button onClick={() =>deleteChat(index)} className="text-white text-xl">
                                {session[0]?.title && ( <img src={'/images/bin.png'} className='w-4 cursor-pointer'/> )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
