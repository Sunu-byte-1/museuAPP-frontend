import React, { createContext, useContext, useState, useEffect } from 'react';
import ticketsData from '../data/tickets.json';

 /**
  * Contexte Billetterie
  *
  * Responsabilités:
  * - Gérer la liste des billets disponibles (`tickets`).
  * - Gérer le panier (`cart`) avec ajout/suppression/mise à jour.
  * - Simuler un achat et conserver l'historique (`purchases`).
  * - Exposer des utilitaires: totaux panier, validations de tickets, QR.
  */
const TicketContext = createContext();

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  // -------------------------
  // Etats globaux du contexte
  // -------------------------
  const [tickets, setTickets] = useState(ticketsData);
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les achats depuis le localStorage
  useEffect(() => {
    const savedPurchases = localStorage.getItem('purchases');
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    }
  }, []);

  // ------------------------------------------------
  // Gestion du panier: ajout, suppression, mise à jour
  // ------------------------------------------------
  const addToCart = (ticketId, quantity = 1) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || !ticket.isAvailable) {
      setError('Billet non disponible');
      return { success: false, error: 'Billet non disponible' };
    }

    const existingItem = cart.find(item => item.ticketId === ticketId);
    
    if (existingItem) {
      setCart(prev => 
        prev.map(item => 
          item.ticketId === ticketId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart(prev => [...prev, { ticketId, quantity, ticket }]);
    }

    return { success: true };
  };

  // Ajouter un billet personnalisé (utilisé pour les formules "Visite libre/guidée")
  const addCustomToCart = (ticket, quantity = 1) => {
    const customId = ticket.id || `custom-${Date.now()}`;
    const existingItem = cart.find(item => item.ticketId === customId);
    if (existingItem) {
      setCart(prev => prev.map(item => item.ticketId === customId ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart(prev => [...prev, { ticketId: customId, quantity, ticket: { ...ticket, id: customId, isAvailable: true } }]);
    }
    return { success: true };
  };

  const removeFromCart = (ticketId) => {
    setCart(prev => prev.filter(item => item.ticketId !== ticketId));
    return { success: true };
  };

  const updateCartQuantity = (ticketId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(ticketId);
    }

    setCart(prev => 
      prev.map(item => 
        item.ticketId === ticketId 
          ? { ...item, quantity }
          : item
      )
    );
    return { success: true };
  };

  const clearCart = () => {
    setCart([]);
  };

  // -----------------
  // Utilitaires panier
  // -----------------
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.ticket.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // ----------------------
  // Simulation d'un achat
  // ----------------------
  const purchaseTickets = async (customerInfo) => {
    if (cart.length === 0) {
      setError('Le panier est vide');
      return { success: false, error: 'Le panier est vide' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const purchase = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: customerInfo,
        items: cart.map(item => ({
          ticketId: item.ticketId,
          ticketType: item.ticket.type,
          quantity: item.quantity,
          price: item.ticket.price,
          total: item.ticket.price * item.quantity
        })),
        total: getCartTotal(),
        status: 'confirmed'
      };

      setPurchases(prev => [...prev, purchase]);
      localStorage.setItem('purchases', JSON.stringify([...purchases, purchase]));
      
      clearCart();
      return { success: true, purchase };
    } catch (err) {
      setError('Erreur lors de l\'achat');
      return { success: false, error: 'Erreur lors de l\'achat' };
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------
  // Recherches et validations annexes
  // ---------------------------------
  const getPurchaseById = (id) => {
    return purchases.find(purchase => purchase.id === parseInt(id));
  };

  const getUserPurchases = (userId) => {
    return purchases.filter(purchase => purchase.customer.userId === userId);
  };

  const generateQRCode = (purchaseId) => {
    // Simuler la génération d'un QR code
    return `QR-${purchaseId}-${Date.now()}`;
  };

  const validateTicket = (qrCode) => {
    // Simuler la validation d'un ticket
    const purchase = purchases.find(p => p.qrCode === qrCode);
    if (purchase && purchase.status === 'confirmed') {
      return { valid: true, purchase };
    }
    return { valid: false, error: 'Ticket invalide ou expiré' };
  };

  // Valeurs exposées
  const value = {
    tickets,
    cart,
    purchases,
    isLoading,
    error,
    addToCart,
    addCustomToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    purchaseTickets,
    getPurchaseById,
    getUserPurchases,
    generateQRCode,
    validateTicket
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

