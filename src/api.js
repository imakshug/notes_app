// API Configuration and Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async forgotPassword(email) {
    const response = await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    return response;
  }

  async resetPassword(token, newPassword) {
    const response = await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ 
        token: token,
        new_password: newPassword 
      }),
    });
    
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Notes methods
  async getNotes(skip = 0, limit = 100) {
    return await this.request(`/notes?skip=${skip}&limit=${limit}`);
  }

  async createNote(noteData) {
    return await this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(noteId, updateData) {
    return await this.request(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteNote(noteId) {
    return await this.request(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  // File upload methods
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return await this.request('/upload/image', {
      method: 'POST',
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      body: formData,
    });
  }

  async uploadAudio(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return await this.request('/upload/audio', {
      method: 'POST',
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      body: formData,
    });
  }

  // Link preview method
  async getLinkPreview(url) {
    return await this.request(`/link-preview?url=${encodeURIComponent(url)}`);
  }

  // Labels methods
  async getLabels() {
    return await this.request('/labels');
  }

  async createLabel(labelData) {
    return await this.request('/labels', {
      method: 'POST',
      body: JSON.stringify(labelData),
    });
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Authentication utilities
export const isAuthenticated = () => {
  return !!apiClient.token;
};

export const getCurrentToken = () => {
  return apiClient.token;
};