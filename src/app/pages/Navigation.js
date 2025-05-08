'use client';

import Link from "next/link";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import { useState } from "react";
import { LogoutModal, SignUpModalSuccess, SignUpModalFailed, LoginModalSuccess, LoginModalFailed, LogoutModalSuccess  } from "../Components/Modals";

function Navigation({ isLoginVisible, setIsLoginVisible, isSignUpVisible, setIsSignUpVisible, isLoginSuccessful, setIsLoginSuccessful, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSignUpSuccess, setShowSignUpSuccess] = useState(false);
    const [showSignUpFailed, setShowSignUpFailed] = useState(false);
    const [showLoginSuccess, setShowLoginSuccess] = useState(false);
    const [showLoginFailed, setShowLoginFailed] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    

    const handleLogout = async () => {
    try {
        const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    
        if (response.ok) {
            setUser(null);
            setIsLoginSuccessful(false);
            setShowLogoutModal(false);
            setShowLogoutSuccess(true);
        } else {
            console.error('Logout failed');
        }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    return(
        <main className="flex w-full justify-between items-center p-4 absolute z-1" style={{ background: 'transparent' }} >
            <section className="flex items-center">
                <Link href="/" className="text-white text-lg font-bold mr-4" title='Chatbot of your needs'>Tusk AI</Link>

                <button className="text-sm text-white border border-purple-500 px-6 py-1 rounded hover:bg-purple-900/50 transition-colors">
                    New Chat
                </button>
            </section>

            <section className="flex space-x-4 justify-end">
                {!isLoginVisible && !isSignUpVisible && (
                    <article>
                        {isLoginSuccessful ? (
                            <button onClick={() => setShowLogoutModal(true)} className="bg-red-600 text-white rounded-md px-3 py-2 hover:bg-purple-700 transition-colors w-full">
                                Log out
                            </button>
                        ) : (
                            <div className='flex gap-4'>
                                <button onClick={() => setIsSignUpVisible(true)} className="text-sm text-white border border-purple-500 px-3 py-1 rounded hover:bg-purple-900/50 transition-colors">
                                    Sign Up
                                </button>
                                <button onClick={() => setIsLoginVisible(true)} className="text-sm text-white bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 transition-colors">
                                    Log In
                                </button>
                            </div>
                        )}
                    </article>
                )}

                {(isLoginVisible || isSignUpVisible) && (
                    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs flex items-center justify-center z-2 border-white">
                        <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-purple-900/50">
                            {isSignUpVisible && (
                                <SignUpPage
                                    email={email} 
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    username={username}
                                    setUserName={setUserName}
                                    setIsSignUpVisible={setIsSignUpVisible}
                                    setShowSignUpSuccess={setShowSignUpSuccess}
                                    setShowSignUpFailed={setShowSignUpFailed}
                                />
                            )}

                            {isLoginVisible && (
                                <LoginPage 
                                    email={email} 
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    setIsLoginSuccessful={setIsLoginSuccessful}
                                    setIsLoginVisible={setIsLoginVisible}
                                    setShowLoginSuccess={setShowLoginSuccess}
                                    setShowLoginFailed={setShowLoginFailed}
                                />
                            )}
                        </div>
                    </div>
                )}
                {showLogoutModal && ( <LogoutModal setShowLogoutModal={setShowLogoutModal} handleLogout={handleLogout}/> )}
                <div className="flex items-center justify-center z-4  absolute m-auto left-0 right-0">
                    {showSignUpSuccess && ( <SignUpModalSuccess onClose={() => setShowSignUpSuccess(false)} /> )}
                    {showSignUpFailed && ( <SignUpModalFailed onClose={() => setShowSignUpFailed(false)} /> )}
                    {showLoginSuccess && ( <LoginModalSuccess onClose={() => setShowLoginSuccess(false)} /> )}
                    {showLoginFailed && ( <LoginModalFailed onClose={() => setShowLoginFailed(false)} /> )}
                    {showLogoutSuccess && ( <LogoutModalSuccess onClose={() => setShowLogoutSuccess(false)} /> )}
                </div>
            </section>
        </main>
    );
}

export default Navigation;