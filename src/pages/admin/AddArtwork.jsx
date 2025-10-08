import React, { useState } from 'react';
import { ArrowLeft, Image, Save, X, Download, Check } from 'lucide-react';

const generateQRCode = (text) => {
  const canvas = document.createElement('canvas');
  const size = 200;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);
  
  const cellSize = 10;
  const cells = size / cellSize;
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  ctx.fillStyle = 'black';
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const random = ((seed * (i + 1) * (j + 1)) % 100) / 100;
      if (random > 0.5) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
  
  const drawPositionSquare = (x, y) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
    ctx.fillStyle = 'white';
    ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = 'black';
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
  };
  
  drawPositionSquare(0, 0);
  drawPositionSquare(size - cellSize * 7, 0);
  drawPositionSquare(0, size - cellSize * 7);
  
  return canvas.toDataURL('image/png');
};

const QrCodeModal = ({ artwork, onClose, onDownload }) => {
  if (!artwork) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all animate-scaleIn">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">
              Œuvre Ajoutée !
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">{artwork.title}</h3>
            <p className="text-gray-600 mt-1">Par {artwork.artist}</p>
            <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
              <span>📅 {artwork.year}</span>
              <span>💰 {artwork.price}€</span>
            </div>
          </div>
          
          <div className="p-6 border-2 border-gray-200 rounded-lg inline-block shadow-lg bg-white">
            <img 
              src={artwork.qrCodeBase64} 
              alt={`QR Code de ${artwork.title}`} 
              className="w-48 h-48 mx-auto"
            />
          </div>
          
          <p className="text-sm text-gray-700 font-medium">
            📱 Scannez ce code pour voir les détails de l'œuvre
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">Code QR unique</p>
            <p className="font-mono text-sm font-bold text-gray-800">
              {artwork.qrCode}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => onDownload(artwork)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le QR Code
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ArtworkQRSimulator() {
  const [currentPage, setCurrentPage] = useState('add');
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: '',
    description: '',
    category: '',
    room: '',
    price: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [modalArtwork, setModalArtwork] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Peinture', 'Sculpture', 'Photographie', 'Art numérique',
    'Céramique', 'Textile', 'Mobilier', 'Archéologie', 'Autre'
  ];

  const rooms = [
    'Salle Renaissance', 'Salle Impressionnisme', 'Salle Cubisme',
    'Salle Antiquité', 'Salle Expressionnisme', 'Salle Contemporain',
    'Salle Moderne', 'Salle Médiévale', 'Salle Baroque', 'Salle Rococo'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.artist.trim()) newErrors.artist = 'L\'artiste est requis';
    if (!formData.year || isNaN(formData.year)) newErrors.year = 'L\'année doit être un nombre valide';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.room) newErrors.room = 'La salle est requise';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }
    if (!formData.image) newErrors.image = 'Une image est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const qrCodeBase64 = generateQRCode(`${formData.title}-${qrCode}`);
      
      const newArtwork = {
        id: Date.now(),
        ...formData,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        isAvailable: true,
        qrCode,
        qrCodeBase64
      };
      
      setArtworks(prev => [...prev, newArtwork]);
      setModalArtwork(newArtwork);
      setIsLoading(false);
      
      setFormData({
        title: '', artist: '', year: '', description: '',
        category: '', room: '', price: '', image: ''
      });
      setPreviewImage(null);
    }, 1500);
  };

  const handleModalClose = () => {
    setModalArtwork(null);
    setCurrentPage('list');
  };

  const handleDownloadQrCode = (artwork) => {
    const link = document.createElement('a');
    link.href = artwork.qrCodeBase64;
    link.download = `QR_Code_${artwork.title.replace(/\s/g, '_')}_${artwork.qrCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (currentPage === 'list') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Liste des Œuvres</h1>
              <button
                onClick={() => setCurrentPage('add')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Ajouter une œuvre
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {artworks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Aucune œuvre ajoutée pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map(artwork => (
                <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{artwork.title}</h3>
                    <p className="text-gray-600">{artwork.artist}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{artwork.year}</span>
                      <span className="font-semibold text-blue-600">{artwork.price}€</span>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">QR Code: {artwork.qrCode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('list')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voir la liste des œuvres
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Ajouter une œuvre</h1>
            <div className="w-40"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de base</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'œuvre *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: La Joconde"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artiste *
                  </label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.artist ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Léonard de Vinci"
                  />
                  {errors.artist && <p className="mt-1 text-sm text-red-600">{errors.artist}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.year ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 1503"
                  />
                  {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 15.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez l'œuvre en détail..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Classification</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salle *
                  </label>
                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.room ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une salle</option>
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                  {errors.room && <p className="mt-1 text-sm text-red-600">{errors.room}</p>}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Image de l'œuvre</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition">
                    <div className="space-y-1 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Télécharger une image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                    </div>
                  </div>
                  {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                </div>

                {previewImage && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                    <div className="relative inline-block">
                      <img
                        src={previewImage}
                        alt="Aperçu"
                        className="h-48 w-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setCurrentPage('list')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Ajouter l'œuvre
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <QrCodeModal 
        artwork={modalArtwork} 
        onClose={handleModalClose} 
        onDownload={handleDownloadQrCode}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}