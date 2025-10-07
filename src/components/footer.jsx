import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart
} from 'lucide-react';

 /**
  * Pied de page (Footer)
  *
  * Contenu:
  * - Présentation du musée et liens vers réseaux sociaux
  * - Liens rapides de navigation interne
  * - Informations pratiques (adresse, téléphone, email, horaires)
  * - Formulaire de newsletter (non connecté – démonstration visuelle)
  * - Barre de mentions légales / politiques
  */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Informations du musée */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-brand-gold">Musée des Civilisations Noires</h3>
            <p className="text-gray-300 mb-4">
              Découvrez l'histoire, l'art et la culture à travers nos collections uniques
              et nos expositions exceptionnelles.
            </p>
            <div className="flex space-x-4">
              <a href="facebook.com/mcndakar" className="text-gray-400 hover:text-brand-gold transition-colors duration-500">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="www.x.com/mcndakar" className="text-gray-400 hover:text-brand-gold transition-colors duration-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="instagram.com/mcndakar" className="text-gray-400 hover:text-brand-gold transition-colors duration-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors duration-500">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/billet" className="text-gray-300 hover:text-white transition">
                  Acheter un billet
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="text-gray-300 hover:text-white transition">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/scan" className="text-gray-300 hover:text-white transition">
                  Scanner une œuvre
                </Link>
              </li>
              <li>
                <Link to="/visite-virtuelle" className="text-gray-300 hover:text-white transition">
                  Visite virtuelle
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations pratiques */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informations pratiques</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Autoroute prolongée × <br /> Place de la Gare / <br />
                  Plateau, Dakar
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-gray-300">+221 33 889 11 80</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-[#f5f4ef]">mcn@mcn.sn</span>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-[#f5f4ef] font-bold">
                  <div>Mardi - Dimanche: </div>
                  <div>10h00 - 19h00</div>
                  <div></div>
                  <div>Lundi: Fermé</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {/* Formulaire visuel – ne déclenche pas de requête réseau ici */}
          <div>
            <h4 className="text-lg text-[#f5f4ef] font-semibold mb-4">Newsletter</h4>
            <p className="text-[#f5f4ef] mb-4">
              Restez informé de nos dernières expositions et événements.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="w-full bg-blue-600 text-[#f5f4ef] py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
               Musée des Civilisations Noires.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                CGV
              </a>
            </div>
          </div>
          
          
        </div>
      </div>
    </footer>
  );
}
