import { useState } from "react";

function SignUpPage({ setIsSignUpVisible, setShowSignUpSuccess, setShowSignUpFailed }) {
    const [emailAlreadyExistMessage, setEmailAlreadyExistMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            setTimeout(() => setPasswordError(''), 4000);
            return;
        }

        try {
            const response = await fetch('https://stale-melodie-aaronmarayaa-f2e40747.koyeb.app/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
                credentials: 'include'
            });

            if (response.ok) {
                setIsSignUpVisible(false);
                setShowSignUpSuccess(true);
            } else {
                setShowSignUpFailed(true);
                if (response.status === 400) {
                    const data = await response.json();
                    setEmailAlreadyExistMessage(data.error || 'Email already exists');
                    setTimeout(() => setEmailAlreadyExistMessage(''), 4000);
                }
            }
        } catch (error) {
            console.log(error);
            setShowSignUpFailed(true);
        } finally {
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <form onSubmit={handleSignUp} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Sign Up</h2>

            {emailAlreadyExistMessage && (
                <p className="text-xs text-red-700 font-bold italic">
                    {emailAlreadyExistMessage}
                </p>
            )}

            {passwordError && (
                <p className="text-xs text-red-600 italic font-semibold">
                    {passwordError}
                </p>
            )}

            <input
                type="text"
                placeholder="Enter your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                required
            />

            <input
                type="email"
                placeholder="Example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                required
            />

            <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                required
            />

            <input
                type="password"
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800 border border-purple-900/50 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
                required
            />

            <button
                type="submit"
                className="bg-purple-600 text-white rounded-md px-3 py-2 hover:bg-purple-700 transition-colors w-full"
            >
                Sign Up
            </button>

            <button
                type="button"
                onClick={() => setIsSignUpVisible(false)}
                className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
                Cancel
            </button>
        </form>
    );
}

export default SignUpPage;
