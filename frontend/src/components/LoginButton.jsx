import React from 'react';

const LoginButton = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/login';
    };

    return <button onClick={handleLogin}>Login with Instagram</button>;
};

export default LoginButton;
