import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Données fictives pour la mise en page
const sampleArtworks = [
  {
    id: 1,
    titre: "LES ARDIPITHECINES",
    type: "carte",
    image: "https://res.cloudinary.com/daaiip4ou/image/upload/v1759945892/R8_hjaqim.jpg"
  },
  {
    id: 2,
    titre: "Les Tambours de la Renaissance",
    type: "Photographie",
    image: "https://res.cloudinary.com/daaiip4ou/image/upload/v1759945887/N3_ete14o.jpg"
  },
  {
    id: 3,
    titre: "Masque Demba ou Nimba",
    type: "Sculpture",
    image: "https://res.cloudinary.com/daaiip4ou/image/upload/v1759945891/NN3_nnxk6g.jpg"
  },
  {
    id: 4,
    titre: "Afrique Berceau de l'humanité",
    type: "Osment",
    image: "https://res.cloudinary.com/daaiip4ou/image/upload/v1759945892/R7_mwjsuf.jpg"
  }
];

const HomePage = () => {
  return (
    <div className="min-h-50 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header / Hero */}
      
      <header className="relative w-full h-[50vh] md:h-[60vh] flex flex-col justify-center items-center text-center md:text-left overflow-hidden bg-gradient-to-br from-amber-100 via-gray-300 to-gray-100">
  {/* Formes abstraites / blobs élégantes */}
  <div className="absolute -top-16 -left-16 w-72 h-72 bg-amber-300 rounded-full opacity-30 blur-3xl animate-blob"></div>
  <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-yellow-400 rounded-full opacity-25 blur-3xl animate-blob animation-delay-2000"></div>
  <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gray-300 rounded-full opacity-20 blur-2xl animate-blob animation-delay-4000"></div>

  {/* Contenu */}
  <div className="relative z-10 px-4 sm:px-6 md:px-20 flex flex-col justify-center items-center md:items-start">
    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6 text-gray-800 drop-shadow-lg animate-fadeInUp">
      Bienvenue au Musée Virtuel
    </h1>
    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl text-gray-700 drop-shadow-md animate-fadeInUp delay-200">
      Explorez l’art comme jamais auparavant. Plongez dans nos salles virtuelles ou découvrez nos œuvres emblématiques.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fadeInUp delay-400">
    <Link
  to="/visite-virtuelle/1"
  className="relative bg-white text-amber-600 font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-110 hover:shadow-[0_0_40px_#FFBF00] flex items-center gap-2 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-lg before:bg-gradient-to-r before:from-amber-300 before:via-yellow-200 before:to-amber-300 before:opacity-0 before:blur-xl before:transition-all before:duration-500 hover:before:opacity-50"
>
  Entrer en immersion
  <ArrowRight size={20} />
</Link>

<Link
  to="/decouvrir"
  className="relative bg-amber-600 text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-110 hover:shadow-[0_0_40px_#FFD700] flex items-center gap-2 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-lg before:bg-gradient-to-r before:from-yellow-400 before:via-amber-500 before:to-yellow-400 before:opacity-0 before:blur-xl before:transition-all before:duration-500 hover:before:opacity-50"
>
  Découvrir les œuvres
  <ArrowRight size={20} />
</Link>

    </div>
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
    </div>
  );
};

export default HomePage;
