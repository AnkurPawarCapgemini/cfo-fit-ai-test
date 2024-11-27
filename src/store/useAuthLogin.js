import { create } from 'zustand';
import API_BASE_URL from '../endPoint.js';

const useAuthLogin = create((set) => ({
  user: localStorage.getItem('authUser') || null, // Initialize user from localStorage
  err: null,
  isAuthenticated: !!localStorage.getItem('authToken'), // Initialize based on stored token
  token: localStorage.getItem('authToken') || null, // Initialize token from localStorage

  login: async (username, password, rememberMe) => {
    try {
      console.log('Login attempt...');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful, token:', data.accessToken);

      // Always store token and username in localStorage after successful login
      localStorage.setItem('authToken', data.accessToken); // Store token
      localStorage.setItem('authUser', data.username); // Store username
      console.log('Token stored:', localStorage.getItem('authToken'));

      // Notify other tabs about the login
      window.localStorage.setItem('isLoggedIn', Date.now());

      set({
        user: data.username,
        token: data.accessToken,
        err: null,
        isAuthenticated: true,
      });

      // Optionally handle the "rememberMe" functionality, e.g., refresh token mechanism
      if (!rememberMe) {
        // You can add session-specific logic if needed (e.g., session storage)
        console.log('RememberMe not checked, but token is stored for session');
      }

    } catch (error) {
      console.error('Login error:', error.message);
      set({ err: error.message });
    }
  },

  logout: () => {
    console.log('Logging out...');
    set({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    console.log('Token removed:', localStorage.getItem('authToken'));

    // Notify other tabs about the logout
    window.localStorage.setItem('isLoggedOut', Date.now());
  },

  checkAuthOnLoad: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    if (token && user) {
      console.log('Restoring authentication state from localStorage');
      set({ token, user, isAuthenticated: true });
    } else {
      console.log('No valid token found, redirecting to login');
      set({ isAuthenticated: false });
    }
  }
}));

// Listen for changes in localStorage to handle login/logout across tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'isLoggedIn' || event.key === 'isLoggedOut') {
    useAuthLogin.getState().checkAuthOnLoad();
  }
});

export default useAuthLogin;
