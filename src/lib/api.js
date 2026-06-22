// API service for communicating with Python backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};

// Auth APIs
export const authAPI = {
  // Login
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    // Store token
    localStorage.setItem('authToken', data.access_token);
    return data;
  },

  // Register
  register: async (email, username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    const data = await response.json();
    // Store token
    localStorage.setItem('authToken', data.access_token);
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Image APIs
export const imageAPI = {
  // Upload image directly
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    return await response.json();
  },

  // Get all user images
  getImages: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/images`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    
    const data = await response.json();
    return data.images || data;
  },

  // Delete image
  deleteImage: async (imageId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/images/${imageId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    
    return await response.json();
  },

  // Get presigned upload URL
  getPresignedUploadUrl: async (fileName, contentType) => {
    const formData = new FormData();
    formData.append('file_name', fileName);
    formData.append('content_type', contentType);
    
    const response = await fetchWithAuth(`${API_BASE_URL}/api/images/presigned-upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }
    
    return await response.json();
  },
};

export default {
  authAPI,
  imageAPI,
};
