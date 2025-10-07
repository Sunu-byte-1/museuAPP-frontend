/**
 * Composant scanner d'œuvres d'art amélioré
 * 
 * Responsabilités:
 * - Scanner les QR codes des œuvres avec la caméra
 * - Valider les QR codes via l'API backend
 * - Afficher un popup d'authentification si nécessaire
 * - Animer les transitions et interactions
 * - Gérer les erreurs et états de chargement
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, QrCode, CheckCircle, XCircle, User, Lock, AlertCircle } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useUser } from '../../context/UserContext.jsx';
import { artworkService, handleApiError } from '../../services/api.js';
import AuthPopup from '../../components/AuthPopup.jsx';

export default function ScanArtworkEnhanced() {
    // États du scanner
    const [isScanning, setIsScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [locationAllowed, setLocationAllowed] = useState(null);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    
    // Références pour la caméra et la détection
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();

    // Simulation de la vérification de localisation
    useEffect(() => {
        setLocationAllowed(null);
        setError(null);
        const timer = setTimeout(() => setLocationAllowed(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    /**
     * Démarrer le scanner de caméra
     */
    const startScanning = async () => {
        try {
            if (!videoRef.current) {
                setError('Élément vidéo non trouvé');
                return;
            }

            // Créer le scanner QR
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                (result) => {
                    setScannedCode(result.data);
                    validateQRCode(result.data);
                },
                {
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            // Démarrer le scanner
            await qrScannerRef.current.start();
            setIsScanning(true);
            setError(null);

        } catch (err) {
            console.error(err);
            setError('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès à la caméra.');
        }
    };

    /**
     * Arrêter le scanner
     */
    const stopScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
            qrScannerRef.current.destroy();
            qrScannerRef.current = null;
        }
        setIsScanning(false);
    };

    /**
     * Capturer une image pour analyse (fallback)
     */
    const captureFrame = () => {
        // Simuler un QR code pour les tests
        const mockQRCode = `QR${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0')}`;
        setScannedCode(mockQRCode);
        validateQRCode(mockQRCode);
    };

    /**
     * Valider le QR code avec l'API backend
     */
    const validateQRCode = async (code) => {
        setIsValidating(true);
        
        try {
            // Vérifier si l'utilisateur est connecté
            if (!isAuthenticated) {
                setShowAuthPopup(true);
                setIsValidating(false);
                return;
            }
            
            // Appeler l'API pour valider le QR code
            const response = await artworkService.getArtworkByQR(code);
            
            if (response.success) {
                setScanResult({
                    valid: true,
                    artwork: response.data,
                    message: 'QR Code valide ! Redirection vers les détails de l\'œuvre...',
                });
            } else {
                setScanResult({
                    valid: false,
                    message: response.message || 'QR Code invalide. Veuillez scanner un QR code d\'œuvre d\'art.',
                });
            }
        } catch (error) {
            console.error('Erreur lors de la validation du QR code:', error);
            const errorInfo = handleApiError(error);
            
            setScanResult({
                valid: false,
                message: errorInfo.message || 'Erreur lors de la validation du QR code.',
            });
        } finally {
            setIsValidating(false);
        }
    };

    /**
     * Recommencer le scan
     */
    const handleScanAgain = () => {
        setScannedCode(null);
        setScanResult(null);
        setError(null);
    };

    /**
     * Voir les détails de l'œuvre
     */
    const handleViewArtwork = () => {
        if (scanResult && scanResult.valid && scanResult.artwork) {
            navigate(`/artwork/${scanResult.artwork.id}`);
        }
    };

    /**
     * Fermer le popup d'authentification
     */
    const handleAuthClose = () => {
        setShowAuthPopup(false);
        setScannedCode(null);
        setScanResult(null);
    };

    // Nettoyage à la fermeture
    useEffect(() => {
        return () => stopScanning();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Vérification de localisation */}
                <AnimatePresence>
                    {locationAllowed === null && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Vérification de votre position...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interface de démarrage */}
                <AnimatePresence>
                    {!isScanning && !scannedCode && !scanResult && locationAllowed === true && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                        >
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                                    className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <QrCode className="w-12 h-12 text-blue-600" />
                                </motion.div>
                                
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-bold text-gray-900 mb-4"
                                >
                                    Scanner un QR Code
                                </motion.h2>
                                
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-600 mb-8"
                                >
                                    Pointez votre caméra vers le QR code d'une œuvre d'art pour obtenir des informations détaillées.
                                </motion.p>
                                
                                {!isAuthenticated && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
                                    >
                                        <div className="flex items-center">
                                            <Lock className="w-5 h-5 text-amber-600 mr-2" />
                                            <p className="text-amber-800 text-sm">
                                                Vous devez être connecté pour scanner les œuvres
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                                
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startScanning}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
                                >
                                    <Camera className="w-5 h-5 mr-2" />
                                    Démarrer le scan
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interface de scan */}
                <AnimatePresence>
                    {isScanning && !scannedCode && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-96 object-cover rounded-lg bg-black"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-64 h-64 border-4 border-blue-500 rounded-lg relative"
                                    >
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600 mb-4">Pointez la caméra vers le QR code</p>
                                <div className="flex justify-center space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={captureFrame}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        Test QR Code
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={stopScanning}
                                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                                    >
                                        Annuler
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interface de validation */}
                <AnimatePresence>
                    {scannedCode && !scanResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-lg p-8 text-center"
                        >
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {isValidating ? 'Validation du QR Code...' : 'Analyse du QR Code...'}
                            </h3>
                            <p className="text-gray-600">Code détecté: {scannedCode}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interface de résultat */}
                <AnimatePresence>
                    {scanResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-lg p-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                    scanResult.valid ? 'bg-green-100' : 'bg-red-100'
                                }`}
                            >
                                {scanResult.valid ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-600" />
                                )}
                            </motion.div>

                            <h3
                                className={`text-xl font-semibold mb-2 ${
                                    scanResult.valid ? 'text-green-900' : 'text-red-900'
                                }`}
                            >
                                {scanResult.valid ? 'QR Code valide !' : 'QR Code invalide'}
                            </h3>

                            <p className="text-gray-600 mb-6">{scanResult.message}</p>

                            {scanResult.valid && scanResult.artwork && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gray-50 rounded-lg p-4 mb-6"
                                >
                                    <h4 className="font-medium text-gray-900 mb-2">{scanResult.artwork.title}</h4>
                                    <p className="text-sm text-gray-600">par {scanResult.artwork.artist}</p>
                                </motion.div>
                            )}

                            <div className="flex space-x-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleScanAgain}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                                >
                                    Scanner à nouveau
                                </motion.button>
                                {scanResult.valid && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleViewArtwork}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Voir l'œuvre
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Affichage des erreurs */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
                        >
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Élément vidéo pour le scanner QR */}
                <video ref={videoRef} className="hidden" />
            </div>

            {/* Popup d'authentification */}
            <AuthPopup
                isOpen={showAuthPopup}
                onClose={handleAuthClose}
                defaultMode="login"
            />
        </div>
    );
}
