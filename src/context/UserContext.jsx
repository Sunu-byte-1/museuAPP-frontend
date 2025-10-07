import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, handleApiError } from '../services/api.js';

 /**
  * Contexte utilisateur
  * 
  * Responsabilités:
  * - Stocker l'état d'authentification (utilisateur courant, chargement, erreurs).
  * - Fournir des actions: `login`, `register`, `logout`, `updateProfile`.
  * - Persister la session dans `localStorage` pour conserver la connexion.
  */
const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Vérifier la validité du token avec le serveur
          const response = await authService.getMe();
          if (response.success) {
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            // Token invalide, nettoyer le localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Erreur de vérification du token:', error);
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };
    
    checkAuthStatus();
  }, []);

  /**
   * Authentification d'un utilisateur existant.
   * - Appel API vers le backend
   * - Valide l'email/mot de passe via l'API
   * - Stocke l'utilisateur et le token dans l'état et `localStorage`
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Stocker le token et les informations utilisateur
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      return { success: false, error: errorInfo.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inscription d'un nouvel utilisateur.
   * - Appel API vers le backend
   * - Vérifie l'unicité de l'email via l'API
   * - Crée et persiste l'utilisateur avec token
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        // Stocker le token et les informations utilisateur
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      return { success: false, error: errorInfo.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnexion: efface l'utilisateur et la persistance.
   */
  const logout = async () => {
    try {
      // Appeler l'API de déconnexion si l'utilisateur est connecté
      if (user) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage et l'état
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  /**
   * Mise à jour des informations du profil via l'API.
   * - Appel API vers le backend
   * - Met à jour le profil utilisateur
   */
  const updateProfile = async (updatedData) => {
    if (!user) return { success: false, error: 'Non connecté' };
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateProfile(updatedData);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      return { success: false, error: errorInfo.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Valeurs exposées au reste de l'application
  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

