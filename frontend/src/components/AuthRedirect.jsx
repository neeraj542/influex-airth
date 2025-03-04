import React, { useState, useEffect } from 'react';
import FAQForm from '../pages/FAQForm';
// import Footer from './layout/Footer';
// import Header from './layout/Header';
import axios from 'axios';

const AuthRedirect = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [lambdaResponse, setLambdaResponse] = useState(null);

    useEffect(() => {
        // Check if there's an auth code in the URL
        const params = new URLSearchParams(window.location.search);
        const authCode = params.get('code');

        if (authCode) {
            console.log("Auth Code Retrieved from URL:", authCode);

            // Step 1: Exchange auth code for short-lived token
            console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/api/exchange-token`, {
                    params: { code: authCode },
                })
                .then((response) => {
                    console.log("Short-Lived Token Response:", response.data);

                    const shortLivedToken = response.data.access_token;

                    // Step 2: Exchange short-lived token for long-lived token and Lambda response
                    return axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/exchange-long-lived-token`,
                        {
                            params: { access_token: shortLivedToken },
                        }
                    );
                })
                .then((response) => {
                    // Log the entire response data to see its structure
                    console.log("Long-Lived Token Response:", response.data);
                
                    // Extract the long-lived token from the response
                    const longLivedToken = response.data.longLivedToken.access_token;
                
                    // Check if lambdaResponse exists in the response data
                    if (response.data.lambdaResponse) {
                        // If lambdaResponse exists, log it and update state
                        console.log("Lambda Response:", response.data.lambdaResponse);
                        setLambdaResponse(response.data.lambdaResponse); // Set state for lambdaResponse
                    } else {
                        // If lambdaResponse doesn't exist, log a warning
                        console.warn("Lambda Response not found in response", response.data);
                    }
                
                    // Store the long-lived token in localStorage for future use
                    localStorage.setItem('accessToken', longLivedToken);
                
                    // Set the long-lived token in component state
                    setAccessToken(longLivedToken);
                
                    // Optionally, clear the URL query parameters (auth code)
                    window.history.replaceState({}, document.title, window.location.pathname);
                })                
                .catch((error) => {
                    console.error("Failed to get token:", error.response?.data || error.message);
                });
        }
    }, []);

    useEffect(() => {
        console.log("Lambda Response:", lambdaResponse);
    }, [lambdaResponse]);

    return (
        <>
            {accessToken && (
                <div className="container">
                    <p>
                        <b>Access Token:</b> {accessToken}
                    </p>
                    {lambdaResponse && (
                        <p>
                            <b>Lambda Response:</b> {JSON.stringify(lambdaResponse)}
                        </p>
                    )}
                </div>
            )}
{/*             <Header/> */}
            <FAQForm />
{/*             <Footer /> */}
        </>
    );
};

export default AuthRedirect;








// import React from 'react';
// import FAQForm from '../pages/FAQForm';
// import Footer from './layout/Footer';



// const AuthRedirect = () => (
//   <>
//     <FAQForm />
//     <Footer />
//   </>
// );

// export default AuthRedirect;
