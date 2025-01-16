import React from 'react';

const Success = ({ accessToken, userId }) => (
    <div>
        <h2>Login Successful!</h2>
        <p>Access Token: {accessToken}</p>
        <p>User ID: {userId}</p>
    </div>
);

export default Success;
