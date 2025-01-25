import axios from 'axios';

/**
 * Axios instance for making API requests with a predefined base URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * Initiates the login process by sending a request to the backend.
 * If successful, it redirects the user to the Instagram login page.
 *
 * @async
 * @function login
 * @returns {Promise<void>} Resolves if the request is successful, otherwise logs an error.
 */
export const login = async () => {
  try {
    const response = await api.get('/auth/login');
    window.location.href = response.request.responseURL; // Redirect to Instagram login
  } catch (error) {
    console.error('Error during login:', error.message);
  }
};

/**
 * Fetches user information using an access token.
 *
 * @async
 * @function fetchUserInfo
 * @param {string} accessToken - The Instagram access token.
 * @returns {Promise<Object>} The user information returned from the API.
 * @throws {Error} Throws an error if the API request fails.
 */
export const fetchUserInfo = async (accessToken) => {
  try {
    const response = await api.get('/api/user-info', {
      params: { access_token: accessToken },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    throw error;
  }
};
