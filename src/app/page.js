'use client';

import Navigation from './Pages/Navigation';
import { useEffect, useState } from 'react';
import MainContent from './Pages/MainContent';

function App() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
        console.log(data);
      } else {
        setIsLoginSuccessful(true);
        console.log("login failed")
    }
    } catch (error) {
    console.error('Error fetching user:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return <div className='w-full text-center'>Loading...</div>; 
  }

  if (isLoginSuccessful && !user) {
    return <div className="w-full text-center">Login succeeded, but no user data. Please refresh.</div>;
  }

  return (
    <main>
      <section>
        <Navigation 
          isLoginVisible={isLoginVisible} 
          setIsLoginVisible={setIsLoginVisible}
          isSignUpVisible={isSignUpVisible} 
          setIsSignUpVisible={setIsSignUpVisible}
          isLoginSuccessful={isLoginSuccessful}
          setIsLoginSuccessful={setIsLoginSuccessful}
          setUser={setUser}
          fetchUser={fetchUser}
        />
      </section>
      <section>
        <MainContent
          user={user}
          setUser={setUser}
          isLoginSuccessful={isLoginSuccessful} 
        />
      </section>
    </main>
  );
}

export default App;