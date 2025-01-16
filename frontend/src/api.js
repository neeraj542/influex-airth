import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const login = async () => {
  try {
    const response = await api.get('/auth/login');
    window.location.href = response.request.responseURL; // Redirect to Instagram login
  } catch (error) {
    console.error('Error during login:', error.message);
  }
};

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
