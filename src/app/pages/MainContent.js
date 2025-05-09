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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        } else {
            setChatHistory([]);
            setChats([]);
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
            <section className='flex w-full mt-15  transition-all duration-300 ease-in-out'>
                <aside className={`h-full  relative self-start flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0 p-0'}`}>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-xs w-7 text-white hover:text-red-400 mb-4"
                    >
                        <img src={'/closeSidebar.png'} className='w-7'/>
                    </button>
                    <button className="text-sm w-50 text-white border border-purple-500 px-6 py-1 rounded hover:bg-purple-900/50 transition-colors">
                        New Chat
                    </button>
                    <button className="text-sm w-50 text-white border border-purple-500 px-6 py-1 rounded hover:bg-purple-900/50 transition-colors">
                        New Chat
                    </button>
                    {chats.map((session, index) => (
                        <div key={index} className='overflow-hidden flex items-center'>
                        <span
                            className="p-2 my-1 w-50 cursor-pointer w-full hover:bg-gray-800 rounded"
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

                <article className='flex items-center relative justify-center w-full h-full relative'>
                    {!isSidebarOpen && (
                        <div className='flex gap-2 absolute top-0 left-0 '>
                            
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="self-start text-white text-xs hover:text-green-400"
                            >
                                <img src={'/openSidebar.png'} className='w-7'/>
                            </button>
                            <button className="text-sm w-50 text-white border border-purple-500 px-6 py-1 rounded hover:bg-purple-900/50 transition-colors">
                                New Chat
                            </button>
                        </div>
                        
                    )}

                    <section className="">
                        <div className="overflow-y-scroll w-full px-60 h-[40rem]">
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
                                    <ReactMarkdown
                                        components={{
                                            p: ({node, ...props}) => (
                                            <p className="break-words mb-4 leading-relaxed text-gray-100">
                                                {props.children}
                                            </p>
                                            ),
                                            
                                            code: ({node, ...props}) => (
                                            <code className="break-words font-mono text-sm bg-gray-800/70 text-purple-200 px-1.5 py-0.5 rounded">
                                                {props.children}
                                            </code>
                                            ),
                                            
                                            pre: ({node, ...props}) => (
                                            <div className="relative my-4 rounded-lg overflow-hidden border border-gray-600/50 bg-gray-900/80">
                                                <div className="flex items-center px-4 py-2 bg-gray-800/80 border-b border-gray-700">
                                                    <div className="flex space-x-2">
                                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    </div>
                                                </div>
                                                <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-100">
                                                {props.children}
                                                </pre>
                                            </div>
                                            ),
                                            
                                            // Links with nice hover effect
                                            a: ({node, ...props}) => (
                                            <a 
                                                href={props.href} 
                                                className="break-words underline text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {props.children}
                                            </a>
                                            ),
                                            
                                            // Headings with gradient text
                                            h1: ({node, ...props}) => (
                                            <h1 className="text-3xl font-bold mt-8 mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                                {props.children}
                                            </h1>
                                            ),
                                            h2: ({node, ...props}) => (
                                            <h2 className="text-2xl font-bold mt-6 mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                {props.children}
                                            </h2>
                                            ),
                                            h3: ({node, ...props}) => (
                                            <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-300">
                                                {props.children}
                                            </h3>
                                            ),
                                            
                                            // Lists with better spacing
                                            ul: ({node, ...props}) => (
                                            <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-200">
                                                {props.children}
                                            </ul>
                                            ),
                                            ol: ({node, ...props}) => (
                                            <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-200">
                                                {props.children}
                                            </ol>
                                            ),
                                            
                                            // Blockquotes with elegant styling
                                            blockquote: ({node, ...props}) => (
                                            <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-300 bg-gray-800/30 py-2 rounded-r">
                                                {props.children}
                                            </blockquote>
                                            ),
                                            
                                            // Tables with clean styling
                                            table: ({node, ...props}) => (
                                            <div className="overflow-x-auto my-4 rounded-lg border border-gray-700">
                                                <table className="min-w-full divide-y divide-gray-700">
                                                {props.children}
                                                </table>
                                            </div>
                                            ),
                                            th: ({node, ...props}) => (
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-purple-300 bg-gray-800/80">
                                                {props.children}
                                            </th>
                                            ),
                                            td: ({node, ...props}) => (
                                            <td className="px-4 py-2 text-sm text-gray-200 border-t border-gray-700">
                                                {props.children}
                                            </td>
                                            ),
                                            
                                            hr: ({node, ...props}) => (
                                            <hr className="my-6 border-t-2 border-transparent bg-gradient-to-r from-transparent via-purple-500 to-transparent h-0.5" />
                                            )
                                        }}
                                        >
                                        {entry.answer}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                ))}
                                <div ref={bottomRef} className='mb-35'/>
                            </div>
                        </div>
                    </section>

                    <section className="absolute bottom-0 left-0 right-0 flex justify-center px-4">
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