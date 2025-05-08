'use client';

import Navigation from './Pages/Navigation';
import { useEffect, useState } from 'react';
import MainContent from './Pages/MainContent';

function App() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isMainContentVisible, setIsMainContentVisible] = useState(true);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsLoginVisible();
    setIsSignUpVisible();
  }, []);

  const signUpVisible = (visible) => {
    setIsSignUpVisible(visible);
    setIsMainContentVisible(!visible);
}

const logInVisible = (visible) => {
    setIsLoginVisible(visible);
    setIsMainContentVisible(!visible);
}

  return (
    <main>
      <div>
        <Navigation 
          isLoginVisible={isLoginVisible} 
          logInVisible={logInVisible}
          setIsSignUpVisible={setIsSignUpVisible}
          isSignUpVisible={isSignUpVisible} 
          signUpVisible={signUpVisible}
          isLoginSuccessful={isLoginSuccessful}
          setIsLoginSuccessful={setIsLoginSuccessful}
          setUser={setUser}
        />
      </div>
      <div style={{ display: isMainContentVisible ? 'block' : 'none' }}>
        <MainContent
          user={user}
          setUser={setUser}
          isLoginSuccessful={isLoginSuccessful} 
        />
      </div>
    </main>
  );
}

export default App;