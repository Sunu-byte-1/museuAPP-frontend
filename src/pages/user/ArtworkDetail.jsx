import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, QrCode, MapPin, Calendar, User } from 'lucide-react';

export default function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArtworkById } = useAdmin();
  const [artwork, setArtwork] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const artworkData = getArtworkById(id);
    if (artworkData) {
      setArtwork(artworkData);
    } else {
      navigate('/');
    }
  }, [id, getArtworkById, navigate]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleScanQR = () => {
    setShowQR(true);
    // Simuler le scan QR
    setTimeout(() => {
      setShowQR(false);
      alert('QR Code scanné ! Redirection vers la visite virtuelle...');
      navigate(`/visite-virtuelle/${id}`);
    }, 2000);
  };

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'œuvre...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Détails de l'œuvre</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Audio Guide */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                Guide audio
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleAudio}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">2:30 / 5:45</p>
                </div>
                <button
                  onClick={toggleMute}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
              <p className="text-xl text-gray-600 mb-4">par {artwork.artist}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">Année</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{artwork.year}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center text-gray-600 mb-2">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">Catégorie</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{artwork.category}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="font-medium">Localisation</span>
              </div>
              <p className="text-lg text-gray-900">{artwork.room}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleScanQR}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition flex items-center justify-center"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scanner QR Code
              </button>
              
              <Link
                to={`/visite-virtuelle/${id}`}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Visite virtuelle
              </Link>
            </div>

            {/* QR Code Modal */}
            {showQR && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-sm mx-4">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold mb-2">Scannage en cours...</p>
                    <p className="text-gray-600">Pointez votre caméra vers le QR code</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
