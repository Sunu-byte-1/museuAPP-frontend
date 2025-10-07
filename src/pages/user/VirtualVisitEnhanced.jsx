/**
 * Composant de visite virtuelle amélioré
 * 
 * Responsabilités:
 * - Afficher une visite virtuelle interactive avec panoramas
 * - Gérer la navigation entre les salles
 * - Intégrer l'authentification pour l'accès
 * - Animer les transitions entre les salles
 * - Afficher les informations des œuvres dans chaque salle
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight, 
    Home, 
    MapPin, 
    Info, 
    Eye, 
    Lock,
    Play,
    Pause,
    Volume2,
    VolumeX
} from 'lucide-react';
import { useUser } from '../../context/UserContext.jsx';
import { artworkService } from '../../services/api.js';
import AuthPopup from '../../components/AuthPopup.jsx';

export default function VirtualVisitEnhanced() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    
    // États de la visite virtuelle
    const [currentRoom, setCurrentRoom] = useState(parseInt(id) || 1);
    const [isLoading, setLoading] = useState(true);
    const [artworks, setArtworks] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    
    // Données des salles du musée
    const rooms = [
        {
            id: 1,
            name: "Salle Renaissance",
            description: "Découvrez les chefs-d'œuvre de la Renaissance européenne",
            panorama: "/panoramas/room1.jpg",
            artworks: [1, 2, 3]
        },
        {
            id: 2,
            name: "Salle Impressionnisme",
            description: "Explorez les œuvres des maîtres impressionnistes",
            panorama: "/panoramas/room2.jpg",
            artworks: [2, 4, 5]
        },
        {
            id: 3,
            name: "Salle Art Moderne",
            description: "Plongez dans l'art moderne et contemporain",
            panorama: "/panoramas/room3.jpg",
            artworks: [3, 5, 1]
        }
    ];

    /**
     * Charger les œuvres de la salle actuelle
     */
    useEffect(() => {
        const loadRoomArtworks = async () => {
            setLoading(true);
            try {
                const room = rooms.find(r => r.id === currentRoom);
                if (room) {
                    const artworkPromises = room.artworks.map(artworkId => 
                        artworkService.getArtworkById(artworkId)
                    );
                    const responses = await Promise.all(artworkPromises);
                    const validArtworks = responses
                        .filter(response => response.success)
                        .map(response => response.data);
                    setArtworks(validArtworks);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des œuvres:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRoomArtworks();
    }, [currentRoom]);

    /**
     * Vérifier l'authentification au chargement
     */
    useEffect(() => {
        if (!isAuthenticated) {
            setShowAuthPopup(true);
        }
    }, [isAuthenticated]);

    /**
     * Changer de salle
     */
    const changeRoom = (direction) => {
        const newRoom = direction === 'next' 
            ? (currentRoom % rooms.length) + 1
            : currentRoom === 1 ? rooms.length : currentRoom - 1;
        
        setCurrentRoom(newRoom);
        setSelectedArtwork(null);
        setShowInfo(false);
    };

    /**
     * Sélectionner une œuvre
     */
    const selectArtwork = (artwork) => {
        setSelectedArtwork(artwork);
        setShowInfo(true);
    };

    /**
     * Fermer le popup d'authentification
     */
    const handleAuthClose = () => {
        setShowAuthPopup(false);
        if (!isAuthenticated) {
            navigate('/');
        }
    };

    /**
     * Basculer la lecture audio
     */
    const toggleAudio = () => {
        setIsMuted(!isMuted);
    };

    /**
     * Basculer la lecture automatique
     */
    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const currentRoomData = rooms.find(room => room.id === currentRoom);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <AuthPopup
                    isOpen={showAuthPopup}
                    onClose={handleAuthClose}
                    defaultMode="login"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Panorama de fond */}
            <div className="absolute inset-0">
                <motion.img
                    key={currentRoom}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    src={currentRoomData?.panorama}
                    alt={currentRoomData?.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>

            {/* Contrôles de navigation */}
            <div className="absolute top-4 left-4 z-20">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition"
                >
                    <Home className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Informations de la salle */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-full"
                >
                    <h1 className="text-lg font-bold">{currentRoomData?.name}</h1>
                    <p className="text-sm opacity-90">{currentRoomData?.description}</p>
                </motion.div>
            </div>

            {/* Contrôles de navigation des salles */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => changeRoom('prev')}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>
            </div>

            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => changeRoom('next')}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition"
                >
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Contrôles audio */}
            <div className="absolute bottom-4 left-4 z-20 flex space-x-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlayback}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAudio}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </motion.button>
            </div>

            {/* Bouton d'informations */}
            <div className="absolute bottom-4 right-4 z-20">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInfo(!showInfo)}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition"
                >
                    <Info className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Points d'intérêt des œuvres */}
            <div className="absolute inset-0 z-10">
                {artworks.map((artwork, index) => (
                    <motion.div
                        key={artwork.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="absolute"
                        style={{
                            top: `${20 + (index * 15)}%`,
                            left: `${30 + (index * 20)}%`
                        }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => selectArtwork(artwork)}
                            className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-300 transition"
                        >
                            <Eye className="w-4 h-4 text-yellow-800" />
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Panneau d'informations */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        className="absolute top-4 right-4 w-80 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 z-30 max-h-96 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Œuvres de la salle</h3>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {artworks.map((artwork) => (
                                <motion.div
                                    key={artwork.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
                                    onClick={() => selectArtwork(artwork)}
                                >
                                    <h4 className="font-medium text-gray-900">{artwork.title}</h4>
                                    <p className="text-sm text-gray-600">par {artwork.artist}</p>
                                    <p className="text-xs text-gray-500 mt-1">{artwork.category}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Détails de l'œuvre sélectionnée */}
            <AnimatePresence>
                {selectedArtwork && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-30"
                    >
                        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6">
                            <div className="flex items-start space-x-4">
                                <img
                                    src={selectedArtwork.image}
                                    alt={selectedArtwork.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{selectedArtwork.title}</h3>
                                    <p className="text-gray-600">par {selectedArtwork.artist}</p>
                                    <p className="text-sm text-gray-500 mt-2">{selectedArtwork.description}</p>
                                    <div className="flex items-center mt-3 space-x-4">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {selectedArtwork.category}
                                        </span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                            {selectedArtwork.year}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedArtwork(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Indicateur de chargement */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
                    >
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement de la salle...</p>
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
    );
}
