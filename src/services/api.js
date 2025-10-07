/**
 * Service API pour la communication avec le backend
 * 
 * Responsabilités:
 * - Configurer Axios avec les URLs de base
 * - Gérer l'authentification automatique
 * - Intercepter les réponses pour gérer les erreurs
 * - Fournir des méthodes pour tous les endpoints
 */

import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mcn-owcd.onrender.com/api';

/**
 * Instance Axios configurée avec les paramètres par défaut
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur de requête pour ajouter automatiquement le token d'authentification
 */
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse pour gérer les erreurs globalement
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Gérer les erreurs de réseau
    if (!error.response) {
      console.error('Erreur de réseau:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Inscription utilisateur
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Connexion administrateur
   */
  adminLogin: async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
  },

  /**
   * Obtenir les informations de l'utilisateur connecté
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Mettre à jour le profil utilisateur
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  /**
   * Changer le mot de passe
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

/**
 * Service des œuvres d'art
 */
export const artworkService = {
  /**
   * Obtenir la liste des œuvres avec recherche et filtres
   */
  getArtworks: async (params = {}) => {
    const response = await api.get('/artworks', { params });
    return response.data;
  },

  /**
   * Obtenir une œuvre par ID
   */
  getArtworkById: async (id) => {
    const response = await api.get(`/artworks/${id}`);
    return response.data;
  },

  /**
   * Obtenir une œuvre par QR code
   */
  getArtworkByQR: async (qrCode) => {
    const response = await api.get(`/artworks/qr/${qrCode}`);
    return response.data;
  },

  /**
   * Créer une nouvelle œuvre (Admin)
   */
  createArtwork: async (artworkData) => {
    const response = await api.post('/artworks', artworkData);
    return response.data;
  },

  /**
   * Mettre à jour une œuvre (Admin)
   */
  updateArtwork: async (id, artworkData) => {
    const response = await api.put(`/artworks/${id}`, artworkData);
    return response.data;
  },

  /**
   * Supprimer une œuvre (Admin)
   */
  deleteArtwork: async (id) => {
    const response = await api.delete(`/artworks/${id}`);
    return response.data;
  },

  /**
   * Basculer la disponibilité d'une œuvre (Admin)
   */
  toggleAvailability: async (id) => {
    const response = await api.patch(`/artworks/${id}/toggle-availability`);
    return response.data;
  },

  /**
   * Obtenir les œuvres populaires
   */
  getPopularArtworks: async (limit = 10) => {
    const response = await api.get(`/artworks/stats/popular?limit=${limit}`);
    return response.data;
  },

  /**
   * Obtenir les statistiques des œuvres (Admin)
   */
  getArtworkStats: async () => {
    const response = await api.get('/artworks/stats/overview');
    return response.data;
  }
};

/**
 * Service des billets
 */
export const ticketService = {
  /**
   * Obtenir la liste des billets disponibles
   */
  getTickets: async (params = {}) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  /**
   * Obtenir un billet par ID
   */
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau billet (Admin)
   */
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  /**
   * Mettre à jour un billet (Admin)
   */
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  /**
   * Supprimer un billet (Admin)
   */
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Basculer la disponibilité d'un billet (Admin)
   */
  toggleAvailability: async (id) => {
    const response = await api.patch(`/tickets/${id}/toggle-availability`);
    return response.data;
  },

  /**
   * Obtenir les billets populaires
   */
  getPopularTickets: async (limit = 10) => {
    const response = await api.get(`/tickets/stats/popular?limit=${limit}`);
    return response.data;
  },

  /**
   * Obtenir les statistiques des billets (Admin)
   */
  getTicketStats: async () => {
    const response = await api.get('/tickets/stats/overview');
    return response.data;
  }
};

/**
 * Service des achats
 */
export const purchaseService = {
  /**
   * Créer un nouvel achat
   */
  createPurchase: async (purchaseData) => {
    const response = await api.post('/purchases', purchaseData);
    return response.data;
  },

  /**
   * Obtenir les achats de l'utilisateur connecté
   */
  getUserPurchases: async (params = {}) => {
    const response = await api.get('/purchases', { params });
    return response.data;
  },

  /**
   * Obtenir un achat par ID
   */
  getPurchaseById: async (id) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  /**
   * Valider un billet par QR code
   */
  validateTicket: async (qrCode) => {
    const response = await api.post('/purchases/validate', { qrCode });
    return response.data;
  },

  /**
   * Annuler un achat
   */
  cancelPurchase: async (id, reason) => {
    const response = await api.patch(`/purchases/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Obtenir les statistiques des ventes (Admin)
   */
  getPurchaseStats: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get('/purchases/stats/overview', { params });
    return response.data;
  }
};

/**
 * Fonction utilitaire pour gérer les erreurs API
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    return {
      message: error.response.data?.message || 'Erreur du serveur',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Erreur de réseau
    return {
      message: 'Erreur de connexion au serveur',
      status: 0,
      data: null
    };
  } else {
    // Autre erreur
    return {
      message: error.message || 'Erreur inconnue',
      status: 0,
      data: null
    };
  }
};

export default api;
