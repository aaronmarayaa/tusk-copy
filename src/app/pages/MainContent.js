'use client';

import { TextArea } from '../Components/TextArea';
import { useState, useRef, useEffect } from 'react';
import MarkdownResponse from '../Components/MarkdownResponse';
import Sidebar from '../Components/Sidebar';
import { ChatDeleteModal, DeleteModalSuccess } from '../Components/Modals';

function MainContent({ user, setUser, isLoginSuccessful, setIsLoginSuccessful}) {
    const [chatHistory, setChatHistory] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [chats, setChats] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [selectedChatIndex, setSelectedChatIndex] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    const textareaRef = useRef(null);
    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [question]);

    useEffect(() => {
        if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    useEffect(() => {
        async function initialize() {
            if (isLoginSuccessful && !hasInitialized) {
                setHasInitialized(true); 
                await fetchUser();
                await fetchChatSessions();
                setPdfFile(null);
                await startNewChatSession();
            } else if (!isLoginSuccessful) {
                setChatHistory([]);
                setChats([]);
                setHasInitialized(false);
                setPdfFile(null);
            }
        }
        initialize();
    }, [isLoginSuccessful, hasInitialized]);
    
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
        const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/auth/userHome', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            setUser(data);
            setIsLoginSuccessful(true);
        } else {
            setIsLoginSuccessful(false);
            console.log("login failed")
        }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    async function startNewChatSession() {
        
        try {
            const sessions = await fetchChatSessions();
                console.log("session", sessions)
                const last = sessions[sessions.length - 1];
                console.log("last", last)
    
                if (last && last.length === 0) {
                    setChatHistory(last);
                } else {
                const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/chats/new-chat', { 
                    method: 'POST',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Session creation failed');
                setChatHistory([]);
                fetchChatSessions();
                }
        } catch (error) {
            console.error('Error starting new session:', error);
        }
    }

    async function fetchChatSessions() {
        try {
            const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/chats/getChat', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            setChats(data); 
            if (!response.ok) throw new Error('Failed to fetch chats');
            return data;
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    }

    const deleteChat = async (index) => {
        try {
            const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/chats/deleteChat', {
                method: 'DELETE',
                body: JSON.stringify({ index }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data.message) {
                const updatedChats = chats.filter((_, i) => i !== index);
                setChats(updatedChats);
                setChatHistory([]);
            } else {
                console.error('Failed to delete chat:', data.message || data.error);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const confirmDeleteChat = async () => {
        if (selectedChatIndex !== null) {
            await deleteChat(selectedChatIndex);
            setShowDeleteModal(false);
            setShowDeleteSuccess(true);
            setSelectedChatIndex(null);
        }
    };

    const analyzePdf = async (e) => {
        e.preventDefault();
        if (!pdfFile) return;
        setLoading(true);

        const newEntry = { question, answer: '...' };
        setChatHistory(prev => [...prev, newEntry]);

        setQuestion('');
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('question', question);

        try {
            const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/tusk/ask-pdf', { 
                method: 'POST', body: formData, credentials: 'include'
            });
            if (!response.ok) throw new Error('Server error');
            const data = await response.json();
            const updatedHistory = data.chatHistory;
            setChatHistory(updatedHistory);
            fetchChatSessions();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const analyzePdfNoLogin = async (e) => {
        e.preventDefault();
        if (!pdfFile) return;
        setLoading(true);

        const newEntry = { question, answer: '...' };
        setChatHistory(prev => [...prev, newEntry]);

        setQuestion('');
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('question', question);

        try {
        const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/tusk/', { 
            method: 'POST', body: formData
        });
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        
        setChatHistory(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], answer: data.answer };
            return updated;
        });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoginSuccessful && !user) {
        return <p className="text-center text-gray-500">Checking authentication...</p>;
    }

    return (
        <main className="flex items-center justify-center flex-grow p-4 bg-gradient-to-b from-black to-gray-900 min-h-screen">
            <section className='flex w-full mt-15 transition-all duration-300 ease-in-out'>
                {isLoginSuccessful && (
                    <Sidebar
                        chats={chats}
                        setChatHistory={setChatHistory}
                        deleteChat={(index) => {
                            setSelectedChatIndex(index);
                            setShowDeleteModal(true);
                        }}
                        isSidebarOpen={isSidebarOpen}
                        startNewChatSession={startNewChatSession}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                )}
                <div className="flex items-center justify-center z-4  absolute m-auto left-0 right-0">
                    {showDeleteModal && (
                        <ChatDeleteModal onConfirm={confirmDeleteChat} onCancel={() => setShowDeleteModal(false)}/>
                    )}

                    {showDeleteSuccess && ( <DeleteModalSuccess onClose={() => setShowDeleteSuccess(false)} /> )}
                </div>

                <article className='flex items-center relative justify-center w-full h-full relative'>
                    {!isSidebarOpen && (
                        <div className='flex gap-2 absolute top-0 left-0 '>
                            {isLoginSuccessful && (
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="self-start text-white text-xs hover:text-green-400"
                                >
                                    <img src={'/images/openSidebar.png'} className='w-7'/>
                                </button>
                            )}
                            <button onClick={() => { isLoginSuccessful ? startNewChatSession : setChatHistory([])}} className="text-sm w-50 text-white border border-purple-500 px-6 py-1 rounded hover:bg-purple-900/50 transition-colors">
                                New Chat
                            </button>
                        </div>
                        
                    )}

                    <section className="w-full">
                        <div className="overflow-y-scroll w-full px-60 h-[40rem] custom-scrollbar">
                            {chatHistory.length === 0 && (
                                <div className="text-center text-gray-400 mt-10 text-lg">
                                    {isLoginSuccessful && (
                                        <div className="text-center text-gray-400 mt-10">
                                        <div className="text-6xl h-20 font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                            {user == null ? '' : `Hello, ${user.username}`}
                                        </div>
                                    </div>
                                    )}
                                    <div className="mb-4">💬 No messages yet</div>
                                    <div className=''>Upload a file then ask about the file to get started </div>
                                </div>
                            )}
                            <div className='mt-4'>
                                {chatHistory.map((entry, index) => (
                                <div key={index} className="py-2 flex flex-col w-full">
                                    <p className='max-w-[75%] px-4 py-3 m-5 rounded-xl self-end bg-purple-600 text-white'><strong></strong> {entry.question}</p>
                                    <div className='w-175 wrap-break-word text-pretty px-4 py-3 self-start text-white'><strong>🤖Tusk:</strong> 
                                        <MarkdownResponse entry={entry}/>
                                    </div>
                                </div>
                                ))}
                                <div ref={bottomRef} className='mb-35'/>
                            </div>
                        </div>
                    </section>

                    <section className="absolute bottom-0 left-0 right-0 flex justify-center px-4">
                        <TextArea pdfFile={pdfFile}
                            setPdfFile={setPdfFile}
                            isLoginSuccessful={isLoginSuccessful}
                            analyzePdf={analyzePdf}
                            analyzePdfNoLogin={analyzePdfNoLogin}
                            textareaRef={textareaRef}
                            question={question}
                            setQuestion={setQuestion}
                            fileInputRef={fileInputRef}
                            chatHistory={chatHistory}
                            loading={loading}
                        />
                    </section>
                </article>
            </section>
        </main>
    );
}

export default MainContent;