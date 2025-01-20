import React from 'react';

const LoginButton = () => {
    const handleLogin = () => {
        // Use environment variable for the backend URL
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        window.location.href = `${backendUrl}/auth/login`;
    };

    return (
        <button 
            onClick={handleLogin} 
            style={{
                padding: '10px 20px',
                backgroundColor: '#ac8fb5',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
            }}
        >
            Login with Instagram
        </button>
    );
};

export default LoginButton;
