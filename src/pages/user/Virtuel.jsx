import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Données fictives pour la mise en page
const sampleArtworks = [
  {
    id: 1,
    titre: "La Nuit Étoilée",
    type: "Peinture",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80"
  },
  {
    id: 2,
    titre: "Le Penseur",
    type: "Sculpture",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80"
  },
  {
    id: 3,
    titre: "Jardin Japonais",
    type: "Photographie",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&q=80"
  },
  {
    id: 4,
    titre: "Portrait Renaissance",
    type: "Peinture",
    image: "https://images.unsplash.com/photo-1578926078623-8e9a2d5e8f3e?w=600&q=80"
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header / Hero */}
      <header className="relative bg-orange-500 text-white py-20 px-6 text-center md:text-left md:px-20 flex flex-col justify-center items-center md:items-start">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenue au Musée Virtuel
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Explorez l’art comme jamais auparavant. Plongez dans nos salles virtuelles ou découvrez nos œuvres emblématiques.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
        <Link
    to="/visite-virtuelle/1"
    className="bg-white text-orange-500 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
  >
    Entrer en immersion
    <ArrowRight size={20} />
  </Link>

  <Link
    to="/decouvrir"
    className="bg-orange-700 hover:bg-orange-800 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
  >
    Découvrir les œuvres
    <ArrowRight size={20} />
  </Link>
        </div>
      </header>

      {/* Section œuvres */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
          Quelques œuvres à découvrir
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleArtworks.map((art) => (
            <div key={art.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={art.image}
                  alt={art.titre}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-orange-500 bg-opacity-90 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  {art.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{art.titre}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  Une œuvre fascinante qui attire l’attention et inspire la curiosité.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-auto text-center text-gray-600">
        &copy; {new Date().getFullYear()} Musée Virtuel. Tous droits réservés.
      </footer>
    </div>
  );
};

export default HomePage;
