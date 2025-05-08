import { useState } from "react";

function SignUpPage({ 
    email, 
    setEmail, 
    password, 
    setPassword, 
    username, 
    setUserName, 
    setIsSignUpVisible, 
    setShowSignUpSuccess,
    setShowSignUpFailed}) {
    const [emailAlreadyExistMessage, setEmailAlreadyExistMessage] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/auth/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
                credentials: 'include'
            });
            if(response.ok) {
                setIsSignUpVisible(false);
                setShowSignUpSuccess(true);
            } else {
                setShowSignUpFailed(true);
            }
            if (response.status === 400) {
                const data = await response.json();
                setEmailAlreadyExistMessage(data.error);
            }
        } catch(error) {
            console.log(error);
            setShowSignUpFailed(true);
        } finally {
            setUserName('');
            setEmail('');
            setPassword('');
        } 
    };

    return(
        <form onSubmit={handleSignUp} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Sign Up</h2>
            <p>
                {emailAlreadyExistMessage == null ? '' : emailAlreadyExistMessage}
            </p>
            <div>
                <input 
                    type="text" 
                    placeholder="Enter your Name" 
                    value={username} 
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                />
            </div>
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
                    placeholder="Enter your Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                />
            </div>
            <button type="submit" className="bg-purple-600 text-white rounded-md px-3 py-2 hover:bg-purple-700 transition-colors w-full">
                Sign Up
            </button>
            <button onClick={() => setIsSignUpVisible(false)} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                Cancel
            </button>
        </form>
    );
}

export default SignUpPage;