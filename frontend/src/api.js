import axios from 'axios';

/**
 * Axios instance for making API requests with a predefined base URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Send cookies when cross-origin requests
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
 * Handles forgot password by sending a request to the backend to initiate the password reset process.
 *
 * @async
 * @function forgotPassword
 * @param {string} email - The user's email address for password recovery.
 * @returns {Promise<void>} Resolves if the request is successful, otherwise logs an error.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    console.log('Password reset link sent successfully:', response.data);
    return response.data; // Return response data if needed
  } catch (error) {
    console.error('Error during forgot password request:', error.response?.data?.message || error.message);
    throw error;
  }
};


/**
 * Resets the user's password.
 *
 * @async
 * @function resetPassword
 * @param {string} token - The password reset token.
 * @param {string} newPassword - The new password entered by the user.
 * @returns {Promise<void>} Resolves if the request is successful, otherwise throws an error.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    console.log('Password reset successful:', response.data); // Log the response to debug
  } catch (error) {
    console.error('Error resetting password:', error.response?.data?.message || error.message);
    throw error;
  }
};

/**
 * Verifies the password reset token (optional).
 *
 * @async
 * @function verifyResetToken
 * @param {string} token - The password reset token from the URL.
 * @returns {Promise<void>} Resolves if the token is valid, otherwise throws an error.
 */
export const verifyResetToken = async (token) => {
  try {
    const response = await api.post('/auth/verify-reset-token', { token });
    console.log('Token is valid:', response.data); // Log the response to debug
  } catch (error) {
    console.error('Error verifying reset token:', error.response?.data?.message || error.message);
    throw error;
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

