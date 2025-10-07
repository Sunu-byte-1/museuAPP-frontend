/**
 * Composant boutique amélioré avec panier popup
 * 
 * Responsabilités:
 * - Afficher les billets disponibles avec animations
 * - Gérer le panier avec popup au lieu d'inline
 * - Intégrer l'authentification pour les achats
 * - Animer les interactions et transitions
 * - Gérer la validation des commandes
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingCart, 
    Plus, 
    Minus, 
    X, 
    CreditCard, 
    CheckCircle,
    Lock,
    User,
    Calendar,
    Clock
} from 'lucide-react';
import { useUser } from '../../context/UserContext.jsx';
import { useTicket } from '../../context/TicketContext.jsx';
import { ticketService, purchaseService, handleApiError } from '../../services/api.js';
import AuthPopup from '../../components/AuthPopup.jsx';

export default function BoutiqueEnhanced() {
    const { user, isAuthenticated } = useUser();
    const { 
        cart, 
        addToCart, 
        removeFromCart, 
        updateCartQuantity, 
        clearCart, 
        getCartTotal, 
        getCartItemCount 
    } = useTicket();
    
    // États de l'interface
    const [tickets, setTickets] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    /**
     * Charger les billets depuis l'API
     */
    useEffect(() => {
        const loadTickets = async () => {
            setLoading(true);
            try {
                const response = await ticketService.getTickets();
                if (response.success) {
                    setTickets(response.data);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des billets:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    /**
     * Ajouter un billet au panier
     */
    const handleAddToCart = (ticket) => {
        if (!isAuthenticated) {
            setShowAuthPopup(true);
            return;
        }
        
        addToCart(ticket.id, 1);
        setShowCart(true);
    };

    /**
     * Mettre à jour la quantité d'un article
     */
    const handleUpdateQuantity = (ticketId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(ticketId);
        } else {
            updateCartQuantity(ticketId, quantity);
        }
    };

    /**
     * Supprimer un article du panier
     */
    const handleRemoveItem = (ticketId) => {
        removeFromCart(ticketId);
    };

    /**
     * Vider le panier
     */
    const handleClearCart = () => {
        clearCart();
        setShowCart(false);
    };

    /**
     * Traiter la commande
     */
    const handleCheckout = async () => {
        if (!isAuthenticated) {
            setShowAuthPopup(true);
            return;
        }

        setIsProcessing(true);
        
        try {
            const purchaseData = {
                customer: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone || ''
                },
                items: cart.map(item => ({
                    ticketId: item.ticketId,
                    quantity: item.quantity
                })),
                paymentMethod: 'card',
                notes: ''
            };

            const response = await purchaseService.createPurchase(purchaseData);
            
            if (response.success) {
                setShowSuccess(true);
                clearCart();
                setShowCart(false);
                
                // Masquer le message de succès après 3 secondes
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Erreur lors de la commande:', error);
            const errorInfo = handleApiError(error);
            alert(`Erreur: ${errorInfo.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Fermer le popup d'authentification
     */
    const handleAuthClose = () => {
        setShowAuthPopup(false);
    };

    /**
     * Filtrer les billets par catégorie
     */
    const filteredTickets = selectedCategory === 'all' 
        ? tickets 
        : tickets.filter(ticket => ticket.category === selectedCategory);

    const categories = ['all', 'Entrée', 'Visite guidée', 'Événement', 'Abonnement', 'Groupe', 'Réduction'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Boutique du Musée</h1>
                    <p className="text-lg text-gray-600">Découvrez nos billets et formules de visite</p>
                </motion.div>

                {/* Filtres de catégories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-2 mb-8"
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {category === 'all' ? 'Tous' : category}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Grille des billets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <AnimatePresence>
                        {isLoading ? (
                            // Squelettes de chargement
                            Array.from({ length: 6 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-2xl shadow-lg p-6"
                                >
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-8 bg-gray-200 rounded"></div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            filteredTickets.map((ticket, index) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {ticket.category}
                                        </span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {ticket.price.toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{ticket.type}</h3>
                                    <p className="text-gray-600 mb-4">{ticket.description}</p>
                                    
                                    {ticket.benefits && ticket.benefits.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Avantages inclus:</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {ticket.benefits.map((benefit, idx) => (
                                                    <li key={idx} className="flex items-center">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAddToCart(ticket)}
                                        disabled={!ticket.isAvailable}
                                        className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                                            !ticket.isAvailable
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {!ticket.isAvailable ? 'Non disponible' : 'Ajouter au panier'}
                                    </motion.button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Bouton panier flottant */}
                {getCartItemCount() > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="fixed bottom-6 right-6 z-40"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowCart(true)}
                            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-6 h-6" />
                                {getCartItemCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                        {getCartItemCount()}
                                    </span>
                                )}
                            </div>
                        </motion.button>
                    </motion.div>
                )}

                {/* Popup du panier */}
                <AnimatePresence>
                    {showCart && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowCart(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-96 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* En-tête du panier */}
                                <div className="flex items-center justify-between p-6 border-b">
                                    <h2 className="text-xl font-bold text-gray-900">Panier</h2>
                                    <button
                                        onClick={() => setShowCart(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Contenu du panier */}
                                <div className="p-6 max-h-64 overflow-y-auto">
                                    {cart.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">Votre panier est vide</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <motion.div
                                                    key={item.ticketId}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{item.ticket.type}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {item.ticket.price.toLocaleString('fr-FR')} FCFA
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.ticketId, item.quantity - 1)}
                                                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.ticketId, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => handleRemoveItem(item.ticketId)}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Total et actions */}
                                {cart.length > 0 && (
                                    <div className="border-t p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-bold text-gray-900">Total:</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {getCartTotal().toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </div>
                                        
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleClearCart}
                                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                Vider
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleCheckout}
                                                disabled={isProcessing}
                                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
                                            >
                                                {isProcessing ? (
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Traitement...
                                                    </div>
                                                ) : (
                                                    'Commander'
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Message de succès */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
                        >
                            <div className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Commande validée avec succès !
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Popup d'authentification */}
                <AuthPopup
                    isOpen={showAuthPopup}
                    onClose={handleAuthClose}
                    defaultMode="login"
                />
            </div>
        </div>
    );
}
