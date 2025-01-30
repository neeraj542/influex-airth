import React, { useState, useEffect } from 'react';
import FAQForm from '../pages/FAQForm';
import Footer from './layout/Footer';
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
                    console.log("Long-Lived Token Response:", response.data);

                  //   // Save the long-lived token and Lambda response
                  //   setAccessToken(response.data.longLivedToken.access_token);
                  //   setLambdaResponse(response.data.lambdaResponse);

                  // // Optionally, store accessToken securely, e.g., in localStorage
                  //   localStorage.setItem('accessToken', response.data.longLivedToken.access_token);

                    const longLivedToken = response.data.longLivedToken.access_token;
                    localStorage.setItem('accessToken', longLivedToken);
                    setAccessToken(longLivedToken); // Set state for accessToken

                    // Optionally clear the URL after processing
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
            <FAQForm />
            <Footer />
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
