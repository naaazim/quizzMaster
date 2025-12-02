import Cookies from 'js-cookie';

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 jours
  secure: window.location.protocol === 'https:', // Secure seulement en HTTPS
  sameSite: 'strict' // CSRF protection
};

export const CookieService = {
  // Set JWT token
  setToken: (token) => {
    Cookies.set('jwt_token', token, COOKIE_OPTIONS);
  },

  // Get JWT token
  getToken: () => {
    return Cookies.get('jwt_token');
  },

  // Set user data
  setUser: (user) => {
    Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
  },

  // Get user data
  getUser: () => {
    const userStr = Cookies.get('user');
    if (!userStr || userStr === 'undefined') return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user cookie:', e);
      return null;
    }
  },

  // Remove token
  removeToken: () => {
    Cookies.remove('jwt_token');
  },

  // Remove user
  removeUser: () => {
    Cookies.remove('user');
  },

  // Clear all auth cookies
  clearAuth: () => {
    Cookies.remove('jwt_token');
    Cookies.remove('user');
  }
};
