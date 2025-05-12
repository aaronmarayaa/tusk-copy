'use client';

import Link from "next/link";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import { useState } from "react";
import { LogoutModal, SignUpModalSuccess, SignUpModalFailed, LoginModalSuccess, LoginModalFailed, LogoutModalSuccess  } from "../Components/Modals";

function Navigation({ isLoginVisible, setIsLoginVisible, isSignUpVisible, setIsSignUpVisible, isLoginSuccessful, setIsLoginSuccessful, setUser, fetchUser }) {
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
        <main className="flex fixed w-full justify-between items-center p-4 absolute z-5" style={{ background: 'transparent' }} >
            <section className="flex items-center">
                <Link href="/" className="text-white text-lg font-bold mr-4" title='Chatbot of your needs'>Tusk AI</Link>
            </section>

            <section className="flex space-x-4 justify-end">
                {!isLoginVisible && !isSignUpVisible && (
                    <article>
                        {isLoginSuccessful ? (
                            <button onClick={() => setShowLogoutModal(true)} className="bg-red-600 text-white rounded-md px-3 py-2 hover:bg-red-900 transition-colors w-full">
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
                                    setIsSignUpVisible={setIsSignUpVisible}
                                    setShowSignUpSuccess={setShowSignUpSuccess}
                                    setShowSignUpFailed={setShowSignUpFailed}
                                />
                            )}

                            {isLoginVisible && (
                                <LoginPage 
                                    setIsLoginSuccessful={setIsLoginSuccessful}
                                    setIsLoginVisible={setIsLoginVisible}
                                    setShowLoginSuccess={setShowLoginSuccess}
                                    setShowLoginFailed={setShowLoginFailed}
                                    fetchUser={fetchUser}
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