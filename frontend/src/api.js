import axios from 'axios';

/**
 * Axios instance for making API requests with a predefined base URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Use this to point to your backend
});

// Add Authorization Header for Protected Routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Use 'jwtToken' for backend token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Handles normal user login by sending a request to the backend.
 *
 * @async
 * @function loginUser
 * @param {Object} formData - The user's login credentials (email and password).
 * @returns {Promise<void>} Resolves if the request is successful, otherwise logs an error.
 */
export const loginUser = async (formData) => {
  try {
    const response = await api.post('/auth/login-user', formData);
    console.log('Backend response:', response.data); // Log the response to debug
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/'; // Redirect to the homepage
    }
  } catch (error) {
    console.error('Error during login:', error.response?.data?.message || error.message);
    throw error;
  }
};

/**
 * Handles user signup by sending a request to the backend.
 *
 * @async
 * @function signup
 * @param {Object} formData - The user's signup information (name, email, and password).
 * @returns {Promise<void>} Resolves if the request is successful, otherwise logs an error.
 */
export const signup = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    const { token } = response.data;

    // Save JWT token to localStorage
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/'; // Redirect to the homepage
    }
  } catch (error) {
    console.error('Error during signup:', error.response?.data?.message || error.message);
    throw error;
  }
};

/**
 * Initiates the Instagram OAuth login process.
 * Redirects the user to the Instagram login page.
 *
 * @async
 * @function initiateInstagramLogin
 * @returns {Promise<void>} Resolves if the request is successful, otherwise logs an error.
 */
export const initiateInstagramLogin = async () => {
  try {
    const response = await api.get('/auth/login'); // Backend Instagram OAuth route
    if (response?.data?.url) {
      window.location.href = response.data.url; // Redirect to Instagram OAuth
    }
  } catch (error) {
    console.error('Error initiating Instagram OAuth login:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    }
    throw error;
  }
};

/**
 * Handles the retrieval of Instagram access token from the redirect URL.
 *
 * @function getInstagramAccessToken
 * @returns {string|null} Instagram access token if found, otherwise null.
 */
export const getInstagramAccessToken = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const instaToken = queryParams.get('access_token');
  if (instaToken) {
    localStorage.setItem('instagramToken', instaToken); // Store Instagram access token
    const newURL = window.location.origin + window.location.pathname; // Clean URL
    window.history.replaceState(null, '', newURL);
    return instaToken;
  }
  return null;
};

/**
 * Logs the user out by removing the tokens from localStorage and redirecting to the login page.
 *
 * @function logout
 */
export const logout = () => {
  try {
    localStorage.removeItem('token'); // Remove JWT token
    localStorage.removeItem('instagramToken'); // Remove Instagram access token
    window.location.href = '/login'; // Redirect to the login page
  } catch (error) {
    console.error('Error during logout:', error.message);
  }
};

/**
 * Fetches the user profile from the backend.
 *
 * @async
 * @function getProfile
 * @returns {Promise<Object>} Resolves with the user profile data if the request is successful, otherwise logs an error.
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data?.message || error.message);
    throw error;
  }
};

export default api;
