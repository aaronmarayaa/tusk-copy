'use client';

import { useState } from "react";

function LoginPage({ 
    setIsLoginSuccessful, 
    setIsLoginVisible,
    setShowLoginSuccess,
    setShowLoginFailed}) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            if(response.ok) {
                setIsLoginSuccessful(true);
                setIsLoginVisible(false);
                setShowLoginSuccess(true);
            } else {
                setShowLoginFailed(true);
                const data = await response.json();
                if (response.status === 401) {
                    setLoginError(data.error);
                    setTimeout(() => {setLoginError(null)}, 4000);
                }
                if(response.status === 404) {
                    setLoginError(`${data.error}, Wrong Email or Password`);
                    setTimeout(() => {setLoginError(null)}, 4000);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setEmail('');
            setPassword('');
        }
    };

    return(
        <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Log In</h2>
            <p className="text-sm text-red-600 italic">{loginError == null ? '' : loginError}</p>
            <div>
                <input 
                    type="email" 
                    placeholder="Example@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                />
            </div>
            <div>
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                />
            </div>
            <button type="submit" className="bg-purple-600 text-white rounded-md px-3 py-2 hover:bg-purple-700 transition-colors w-full">
                Log In
            </button>
            <button onClick={() => setIsLoginVisible(false)} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                Cancel
            </button>
        </form>
    );
}

export default LoginPage;