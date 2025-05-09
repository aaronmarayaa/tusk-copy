'use client';

import { Paperclip, Send, X, Bot } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/navigation';

function MainContent({ user, setUser, isLoginSuccessful }) {
    const [chatHistory, setChatHistory] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [chats, setChats] = useState([]);
    const [currentTitle, setCurrentTitle] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const textareaRef = useRef(null);
    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);

    const router = useRouter();

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
        if (isLoginSuccessful) {
            fetchUser();
            fetchChatSessions();
            setChatHistory([]);
        }
    }, [isLoginSuccessful]);

    const fetchUser = async () => {
        try {
        const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/auth/userHome', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setUser(data);
            console.log("data", data);
        } else {
            router.push('/');
        }
        } catch (error) {
        console.error('Error fetching user:', error);
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

    async function startNewChatSession() {
        const lastSession = chats[chats.length - 1];
        if (lastSession && lastSession.length === 0) {
        setChatHistory(lastSession);
        return;
        }
        try {
        const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/chats/new-chat', { 
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Session creation failed');
        setChatHistory([]);
        fetchChatSessions();
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
            setChats(await data);
            } catch (error) {
            console.error('Error fetching chats:', error);
            }
        
    }

    const deleteChat = async (index) => {
        try {
            const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/chats/deleteChat', {
                method: 'DELETE',
                body: JSON.stringify({ index }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.message) {
                const updatedChats = chats.filter((_, i) => i !== index);
                setChats(updatedChats);
            } else {
                console.error('Failed to delete chat:', data.message || data.error);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
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

    if (isLoginSuccessful) {
        if(!user) {
            return <p className="text-center text-gray-500">Checking authentication...</p>;
        }
    }

    return (
        <main className="flex items-center justify-center flex-grow p-4 bg-gradient-to-b from-black to-gray-900 min-h-screen">
            <section className='flex w-full mt-15'>
                {isSidebarOpen && (
                    <aside className="w-64 h-full p-2 border self-start border-white flex flex-col">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-xs text-white hover:text-red-400 mb-4"
                        >
                            <img src={'/closeSidebar.png'} className='w-7'/>
                        </button>

                        {chats.map((session, index) => (
                            <div key={index} className='overflow-hidden flex items-center'>
                            <span
                                className="p-2 my-1 cursor-pointer w-full hover:bg-gray-800 rounded"
                                onClick={() => {
                                setChatHistory(chats[index]);
                                setCurrentTitle(session[0]?.title || `Chat ${index + 1}`);
                                }}
                            >
                                <p className='truncate text-sm'>{session[0]?.title || `Chat ${index + 1}`}</p>
                            </span>
                            </div>
                        ))}
                    </aside>
                )}
                <article className='flex items-center relative  justify-center w-full h-full border border-white'>
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="absolute top-0 left-0 self-start z-10 text-white text-xs hover:text-green-400"
                        >
                            <img src={'/openSidebar.png'} className='w-7'/>
                        </button>
                    )}

                    <section className="w-full max-w-2xl mb-32">
                        <section className="w-full max-w-2xl flex justify-between items-center text-white mb-6 ">
                            {/* <button className="flex items-center gap-1 text-sm hover:text-purple-400 transition">
                            <Bot className="w-4 h-4" />
                                Chatbot
                            </button> */}
                        </section>
                        <div className="flex flex-col gap-4">
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
                                <div className='max-w-[75%] wrap-break-word text-pretty px-4 py-3 rounded-xl self-start bg-gray-600 text-white'><strong>🤖Tusk:</strong> 
                                    <ReactMarkdown
                                        components={{
                                        p: ({node, ...props}) => <p className="break-words">{props.children}</p>,
                                        code: ({node, ...props}) => (
                                            <code className="break-words whitespace-pre-wrap bg-gray-700 p-1 rounded">
                                            {props.children}
                                            </code>
                                        ),
                                        a: ({node, ...props}) => (
                                            <a href={props.href} className="break-words underline text-blue-300">
                                            {props.children}
                                            </a>
                                        ),
                                        pre: ({node, ...props}) => (
                                            <pre className="break-words whitespace-pre-wrap overflow-x-auto bg-gray-700 p-2 rounded">
                                            {props.children}
                                            </pre>
                                        )
                                        }}
                                    >
                                    {entry.answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                        </div>
                    </section>

                    <section className="fixed bottom-8 left-0 right-0 flex justify-center px-4">
                        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-1 shadow-lg">
                            {pdfFile && (
                                <p className="flex gap-5 items-center text-sm text-gray-600 mt-2 mb-4 ml-3 truncate mb-2">
                                {pdfFile.name}
                                <X className='w-4' 
                                    onClick={() => {
                                        setPdfFile(null);
                                        if(fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                />
                                </p>
                            )}
                            <form onSubmit={isLoginSuccessful ? analyzePdf : analyzePdfNoLogin}>
                                <div className="flex items-end">
                                    <div className="flex-grow flex items-center bg-gray-700/50 rounded-lg pr-2">
                                        <textarea
                                            ref={textareaRef}
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="Message Tusk AI..."
                                            className="w-full bg-transparent text-white focus:outline-none resize-none max-h-50 py-3 px-4"
                                            rows={1}
                                        />
                                        <input ref={fileInputRef} id='file-upload' type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} hidden required/>
                                        <label htmlFor="file-upload" className="cursor-pointer p-2 text-gray-400 hover:text-purple-400 transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                        </label>
                                    </div>
                                    
                                    <button type='submit'
                                        className={`ml-2 p-3 rounded-lg ${chatHistory ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'} transition-colors`}
                                        disabled={loading}
                                    >
                                        <Send className="w-5 h-5 text-white" />
                                    </button>
                                        
                                    
                                </div>
                            </form>
                            <p className="text-xs text-gray-500 mt-2 px-2">
                                Tusk AI may produce inaccurate information. Consider verifying important details.
                            </p>
                        </div>
                    </section>
                </article>
            </section>
        </main>
    );
}

export default MainContent;