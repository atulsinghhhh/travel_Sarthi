import api from './api';

const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Axios response promise
   */
  register: (userData) => {
    return api.post('/register', userData);
  },

  /**
   * Login an existing user
   * @param {Object} credentials - User login credentials (email, password)
   * @returns {Promise} Axios response promise
   */
  login: (credentials) => {
    return api.post('/login', credentials);
  },

  /**
   * Logout the current user
   * @returns {Promise} Axios response promise
   */
  logout: () => {
    return api.post('/logout');
  },

  /**
   * Get the current authenticated user's profile
   * @returns {Promise} Axios response promise
   */
  getCurrentUser: () => {
    return api.get('/user');
  },

  updateAvatar: (formData) => {
    return api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateProfile: (data) => {
    return api.post('/user/profile', data);
  }
};

export default AuthService;
