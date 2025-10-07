import React, { useEffect, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useUser } from "../context/UserContext";
  import { Moon, Sun, ChevronDown, User, LogOut, Menu, X } from "lucide-react";
  
  /**
   * En-tête principal (Header)
   *
   * Responsabilités:
   * - Afficher le logo et les liens de navigation principaux.
   * - Gérer le thème (clair/sombre) via un bouton toggle et persistance localStorage.
   * - Gérer les menus déroulants: sélection de langue (UI) et menu utilisateur (si connecté).
   * - Adapter l'affichage aux écrans mobiles (menu hamburger) et bureau (navigation horizontale).
   */



  export default function Header() {
    // ------------------
    // Etats d'interface
    // ------------------
    const [darkMode, setDarkMode] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useUser();
    const navigate = useNavigate();

    // -----------------------------
    // Gestion de la préférence thème
    // -----------------------------
    const getSavedTheme = () => {
      try {
        return localStorage.getItem('theme');
      } catch (error) {
        void error;
        return null;
      }
    };

    const saveTheme = (value) => {
      try {
        localStorage.setItem('theme', value);
      } catch (error) {
        void error;
      }
    };

    useEffect(() => {
      // A l'initialisation, on applique le thème selon la préférence sauvegardée
      // ou la préférence système si aucune valeur n'est sauvegardée.
      const savedTheme = getSavedTheme();
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      setDarkMode(initialDark);
      const root = document.documentElement;
      if (initialDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      // Ajout de la fluidité sur le changement de thème
      root.classList.add('transition-colors');
      root.style.transitionDuration = '500ms';
    }, []);

    const handleToggleTheme = () => {
      setDarkMode((prev) => {
        const newMode = !prev;
        const root = document.documentElement;
        if (newMode) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        saveTheme(newMode ? 'dark' : 'light');
        return newMode;
      });
    };

    const handleLogout = () => {
      // Déconnecte l'utilisateur puis redirige vers l'accueil
      logout();
      navigate('/');
    };
      

    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold text-orange-600 hover:text-orange-500 transition-colors duration-300">
              MCN
            </Link>

            {/* Desktop Nav Links */}
            {/*
              Liens principaux visibles uniquement sur bureau (>= lg):
              - Accueil, Billet, Boutique, Histoire, Scanner
              Un menu de langue illustre un futur i18n (non implémenté ici).
            */}
            <nav className="hidden lg:flex items-center space-x-8 text-[#1a1a1a] ">
              <Link to="/" className="hover:text-[#b08b4f] transition-colors duration-500 text-lg">
                Accueil
              </Link>
              <Link to="/billet" className="hover:text-[#b08b4f] transition-colors duration-00 text-lg">
                Acheter un billet
              </Link>
                <Link to="/visite-virtuelle/1" className="hover:text-[#b08b4f] transition-colors duration-00 text-lg">
                    Visite virtuelle
                </Link>
              <Link to="/boutique" className="hover:text-[#b08b4f] transition-colors duration-00 text-lg">
                Boutique
              </Link>
              <Link to="/histoire" className="hover:text-[#b08b4f] transition-colors duration-00 text-lg">
                Histoire
              </Link>
              <Link to="/scan" className="hover:text-[#b08b4f] transition-colors duration-00 text-lg">
                Scanner
              </Link>

              {/* Sélecteur de langue (démo UI) */}
            <div className="relative">
    <button
      onClick={() => setLangMenuOpen(!langMenuOpen)}
      className="flex items-center gap-2 hover:text-orange-400 transition"
    >
      <img 
        src="https://flagcdn.com/24x18/fr.png" 
        alt="Français"
        className="w-6 h-4"
      />
      <ChevronDown className="w-4 h-4" />
    </button>

    {langMenuOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white  rounded-lg shadow-lg ">
        <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <img src="https://flagcdn.com/24x18/gb.png" alt="English" className="w-6 h-4" />
          Anglais
        </button>
        <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <img src="https://flagcdn.com/24x18/es.png" alt="Español" className="w-6 h-4" />
          Espagnol
        </button>
        <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <img src="https://flagcdn.com/24x18/sa.png" alt="arabe" className="w-6 h-4" />
          Arabe
        </button>
      </div>
    )}
  </div>
            </nav>

            {/* Desktop Actions */}
            {/*
              Si l'utilisateur est authentifié: bouton profil ouvrant un menu (email, lien admin si rôle admin, logout).
              Sinon: lien vers la page de connexion.
              Le bouton de thème est toujours présent.
            */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline">{user?.firstName}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                          {user?.email}
                        </div>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Administration
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 border border-[#1a1a1a]  text-[#1a1a1a] rounded-full hover:bg-[#1a1a1a] hover:text-white transition"
                >
                  Se connecter
                </Link>
              )}

              {/* Toggle Thème */}
              <button
                onClick={handleToggleTheme}
                className="ml-2 p-2 rounded-full bg-museum-light dark:bg-museum-darkBg text-museum-dark dark:text-brand-gold border border-gray-300 dark:border-brand-gold transition-colors duration-500"
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            {/* Boutons visibles uniquement sur mobile: toggle thème + hamburger */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 hover:scale-110 transition"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {/*
            Menu déroulant affiché sur mobile quand `mobileMenuOpen` est vrai.
            Reprend les liens principaux, et selon l'état d'authentification,
            affiche soit le panneau utilisateur (avec logout), soit le lien de connexion.
          */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white  border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  to="/billet"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Acheter un billet
                </Link>
                <Link
                  to="/boutique"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Boutique
                </Link>
                <Link
                  to="/histoire"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Histoire
                </Link>
                <Link
                  to="/scan"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Scanner
                </Link>
                
                {/* Mobile Auth */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Connecté en tant que {user?.firstName}
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Se déconnecter
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-3 py-2  text-[#1a1a1a] rounded-lg hover:bg-blue-700 transition text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>
        
        {/* Spacer pour compenser la navbar fixe */}
        {/* Ajoute de l'espace sous le header fixé en haut afin d'éviter les recouvrements */}
        <div className="h-16"></div>
      </>
    );
  }
