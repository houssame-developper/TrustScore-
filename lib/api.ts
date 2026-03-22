const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Professor {
  id: string;
  name: string;
  department: string;
  subject: string;
  file?: string;
  created_at: string;
}

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'voter' | 'admin';
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  voter_id: string;
  voter_name?: string;
  prof_id: string;
  created_at: string;
}

async function fetchWithCredentials(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'An error occurred');
    }
    
    return response.json();
  } catch (error) {
    // If fetch fails (network error, CORS, etc.), throw a more descriptive error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    fetchWithCredentials('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    fetchWithCredentials('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () =>
    fetchWithCredentials('/auth/logout', { method: 'POST' }),

  getMe: () =>
    fetchWithCredentials('/auth/me'),

  getKeypair: () =>
    fetchWithCredentials('/auth/me/keypair'),

  verifyToken: () =>
    fetchWithCredentials('/auth/verify_token', { method: 'POST' }),
};

// Professor APIs
export const profApi = {
  getAll: () =>
    fetchWithCredentials('/admin/profs/'),

  getById: (id: string) =>
    fetchWithCredentials(`/admin/profs/${id}`),

  create: (data: { name: string; department: string; subject: string }) =>
    fetchWithCredentials('/admin/profs/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{ name: string; department: string; subject: string }>) =>
    fetchWithCredentials(`/admin/profs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchWithCredentials(`/admin/profs/${id}`, {
      method: 'DELETE',
    }),
};

// Rating APIs
export const ratingApi = {
  getRatingStats: (profId: string) =>
    fetchWithCredentials(`/profs/${profId}/ratings`),

  addRating: (profId: string, rate: number, privateKey: string) =>
    fetchWithCredentials(`/profs/${profId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ rate, private_key: privateKey }),
    }),

  verifyChain: (profId: string) =>
    fetchWithCredentials(`/profs/${profId}/ratings/verify`),

  getLastBlock: (profId: string) =>
    fetchWithCredentials(`/profs/${profId}/ratings/last_block`),
};

// Comment APIs
export const commentApi = {
  getByProfId: (profId: string) =>
    fetchWithCredentials(`/profs/${profId}/comments`),

  create: (profId: string, content: string) =>
    fetchWithCredentials(`/profs/${profId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  update: (profId: string, commentId: string, content: string) =>
    fetchWithCredentials(`/profs/${profId}/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    }),

  delete: (profId: string, commentId: string) =>
    fetchWithCredentials(`/profs/${profId}/comments/${commentId}`, {
      method: 'DELETE',
    }),
};

// SWR fetcher
export const fetcher = (url: string) => fetchWithCredentials(url);
