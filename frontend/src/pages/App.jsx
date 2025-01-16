import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import Success from '../components/Success';
import axios from 'axios';

const Home = () => <LoginButton />;

const Redirect = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/auth/redirect?code=${code}`);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching access token:', err);
            }
        };

        if (code) fetchToken();
    }, [code]);

    return data ? <Success accessToken={data.access_token} userId={data.user_id} /> : <p>Loading...</p>;
};

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/redirect" element={<Redirect />} />
        </Routes>
    </Router>
);

export default App;
