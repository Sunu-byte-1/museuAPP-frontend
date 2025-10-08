import React, { useState, useRef } from 'react';
import { X, Play, Pause } from 'lucide-react';
import artworksData from '../../data/RezDC.json'
// Données JSON des œuvres d'art


const DiscoverArtworks = () => {
  // États pour gérer l'étage actif, la modal et la langue
  const [activeFloor, setActiveFloor] = useState("Rez-de-chaussée");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const audioRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);


  // Liste des étages disponibles
  const floors = ["Rez-de-chaussée", "Premiere etage", "Deuxieme etage"];

  // Filtrer les œuvres selon l'étage actif
  const filteredArtworks = artworksData.filter(
    artwork => artwork.etage === activeFloor
  );

  // Ouvrir la modal avec l'œuvre sélectionnée
  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setSelectedLanguage("fr");
  };

  // Fermer la modal
  const closeModal = () => {
    setSelectedArtwork(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Lire le texte audio dans la langue sélectionnée
  const playAudio = () => {
    if (selectedArtwork && selectedArtwork.texte[selectedLanguage]) {
      const utterance = new SpeechSynthesisUtterance(selectedArtwork.texte[selectedLanguage]);
      const langCodes = { fr: 'fr-FR', en: 'en-US', es: 'es-ES' };
      utterance.lang = langCodes[selectedLanguage];
      utterance.rate = 0.9;
  
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
  
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const pauseAudio = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };
  
  const resumeAudio = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Découvrez nos Collections
        </h1>

        {/* Boutons d'étage */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeFloor === floor
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-100 shadow-md'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* Grille d'œuvres d'art */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image avec type d'œuvre */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={artwork.image}
                  alt={artwork.titre}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-orange-500 bg-opacity-90 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  {artwork.type}
                </div>
              </div>

              {/* Contenu de la card */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {artwork.titre}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {artwork.descriptionCourte}
                </p>
                <button
                  onClick={() => openModal(artwork)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal des détails */}
        {selectedArtwork && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Bouton fermer */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all z-10"
              >
                <X size={24} />
              </button>

              {/* Image agrandie */}
              <div className="relative h-96 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.titre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Contenu du modal */}
              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-semibold mb-3">
                    {selectedArtwork.type}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {selectedArtwork.titre}
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {selectedArtwork.descriptionLongue}
                  </p>
                </div>

                {/* Sélecteur de langue et bouton play */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-6 pt-6 border-t border-gray-200">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none bg-white text-gray-700 font-medium"
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                  </select>
                <button
                    onClick={() => {
                        if (isSpeaking) {
                        pauseAudio();
                        } else {
                        resumeAudio();
                        playAudio();
                        }
                    }}
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
                    >
                    {isSpeaking ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                    {isSpeaking ? 'Pause' : 'Écouter'}
                </button>

                </div>

                {/* Texte dans la langue sélectionnée */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-sm italic">
                    {selectedArtwork?.texte[selectedLanguage]}
                    </p>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverArtworks;