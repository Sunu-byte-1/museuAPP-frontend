import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, QrCode, CheckCircle, XCircle, User, Lock } from 'lucide-react';
import { useUser } from '../../context/UserContext.jsx';
import { artworkService, handleApiError } from '../../services/api.js';
import AuthPopup from '../../components/AuthPopup.jsx';

export default function ScanArtwork() {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [locationAllowed, setLocationAllowed] = useState(null);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();

    // Simulation de la localisation
    useEffect(() => {
        setLocationAllowed(null);
        setError(null);
        const timer = setTimeout(() => setLocationAllowed(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    // ✅ Démarrage caméra compatible PC + mobile
    const startScanning = async () => {
        try {
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(() => {});
                };

                setIsScanning(true);
                setError(null);

                // Initialise le BarcodeDetector si dispo
                if ('BarcodeDetector' in window) {
                    try {
                        detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
                        requestAnimationFrame(scanLoop);
                    } catch {
                        console.warn('BarcodeDetector non initialisé');
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setError('Impossible d’accéder à la caméra. Veuillez autoriser l’accès à la caméra.');
        }
    };

    const stopScanning = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // Fallback : simule un QR code si pas de BarcodeDetector
            if (!detectorRef.current) {
                const mockQRCode = `QR${Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, '0')}`;
                setScannedCode(mockQRCode);
                validateQRCode(mockQRCode);
            }
        }
    };

    const scanLoop = async () => {
        if (!isScanning || !videoRef.current || !canvasRef.current || !detectorRef.current) return;
        try {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            if (video.videoWidth && video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const bitmap = canvas.transferToImageBitmap ? canvas.transferToImageBitmap() : null;
                const results = await detectorRef.current.detect(bitmap || canvas);

                if (results && results.length > 0) {
                    const code = results[0].rawValue || '';
                    if (code) {
                        setScannedCode(code);
                        validateQRCode(code);
                        return;
                    }
                }
            }
        } catch (err) {
            console.warn('Erreur scan loop', err);
        }
        requestAnimationFrame(scanLoop);
    };

    const validateQRCode = (code) => {
        setTimeout(() => {
            if (code.startsWith('QR')) {
                setScanResult({
                    valid: true,
                    artworkId: Math.floor(Math.random() * 5) + 1,
                    artworkTitle: 'Œuvre trouvée',
                    message: 'QR Code valide ! Redirection vers les détails de l’œuvre...',
                });
            } else {
                setScanResult({
                    valid: false,
                    message: 'QR Code invalide. Veuillez scanner un QR code d’œuvre d’art.',
                });
            }
        }, 1500);
    };

    const handleScanAgain = () => {
        setScannedCode(null);
        setScanResult(null);
        setError(null);
    };

    const handleViewArtwork = () => {
        if (scanResult && scanResult.valid) {
            navigate(`/artwork/${scanResult.artworkId}`);
        }
    };

    useEffect(() => {
        return () => stopScanning();
    }, []);

    return (
        <div className="min-h-screen bg-[#f5f4ef]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {locationAllowed === null && (
                    <div className="text-center">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Vérification de votre position...</p>
                        </div>
                    </div>
                )}

                {!isScanning && !scannedCode && !scanResult && locationAllowed === true && (
                    <div className="text-center">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <QrCode className="w-12 h-12 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scanner un QR Code</h2>
                            <p className="text-gray-600 mb-8">
                                Pointez votre caméra vers le QR code d'une œuvre d'art pour obtenir des informations détaillées.
                            </p>
                            <button
                                onClick={startScanning}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
                            >
                                <Camera className="w-5 h-5 mr-2" />
                                Démarrer le scan
                            </button>
                        </div>
                    </div>
                )}

                {isScanning && !scannedCode && (
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-96 object-cover rounded-lg bg-black"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 border-4 border-blue-500 rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 mb-4">Pointez la caméra vers le QR code</p>
                            {!detectorRef.current && (
                                <button
                                    onClick={captureFrame}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition mr-4"
                                >
                                    Capturer
                                </button>
                            )}
                            <button
                                onClick={stopScanning}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {scannedCode && !scanResult && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyse du QR Code...</h3>
                        <p className="text-gray-600">Code détecté: {scannedCode}</p>
                    </div>
                )}

                {scanResult && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                scanResult.valid ? 'bg-green-100' : 'bg-red-100'
                            }`}
                        >
                            {scanResult.valid ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-600" />
                            )}
                        </div>

                        <h3
                            className={`text-xl font-semibold mb-2 ${
                                scanResult.valid ? 'text-green-900' : 'text-red-900'
                            }`}
                        >
                            {scanResult.valid ? 'QR Code valide !' : 'QR Code invalide'}
                        </h3>

                        <p className="text-gray-600 mb-6">{scanResult.message}</p>

                        {scanResult.valid && scanResult.artworkTitle && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="font-medium text-gray-900">{scanResult.artworkTitle}</p>
                            </div>
                        )}

                        <div className="flex space-x-4 justify-center">
                            <button
                                onClick={handleScanAgain}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                            >
                                Scanner à nouveau
                            </button>
                            {scanResult.valid && (
                                <button
                                    onClick={handleViewArtwork}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Voir l'œuvre
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
