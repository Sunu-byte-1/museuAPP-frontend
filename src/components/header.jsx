import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Moon, Sun, User, LogOut, Menu, X } from "lucide-react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Pour gérer les classes actives

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
    document.documentElement.classList.add("transition-colors");
    document.documentElement.style.transitionDuration = "500ms";
  }, []);

  const handleToggleTheme = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fonction helper pour ajouter la classe "active"
  const isActive = (path) => location.pathname === path ? "text-amber-600 font-semibold" : "text-gray-700 hover:text-amber-500 transition-colors";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-orange-600 hover:text-orange-500 transition-colors duration-300">
            MCN
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={`${isActive("/")} text-lg`}>
              Accueil
            </Link>
            <Link to="/billet" className={`${isActive("/billet")} text-lg`}>
              Billet
            </Link>
            <Link to="/HomePage" className={`${isActive("/HomePage")} text-lg`}>
              Visite virtuelle
            </Link>
            <Link to="/boutique" className={`${isActive("/boutique")} text-lg`}>
              Boutique
            </Link>
            <Link to="/histoire" className={`${isActive("/histoire")} text-lg`}>
              Histoire
            </Link>
            <Link to="/scan" className={`${isActive("/scan")} text-lg`}>
              Scanner
            </Link>
          </nav>

          {/* Desktop Actions */}
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
                      {user?.role === "admin" && (
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
                className="px-4 py-2 border border-gray-700 text-gray-700 rounded-full hover:bg-gray-700 hover:text-white transition"
              >
                Se connecter
              </Link>
            )}

            {/* Toggle Theme */}
            {/* <button
              onClick={handleToggleTheme}
              className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-amber-400 border border-gray-300 dark:border-amber-400 transition-colors duration-500"
              title={darkMode ? "Mode clair" : "Mode sombre"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 text-orange-500 hover:scale-110 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-orange-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 space-y-1">
              {[
                { name: "Accueil", path: "/" },
                { name: "Billet", path: "/billet" },
                { name: "Visite virtuelle", path: "/HomePage" },
                { name: "Boutique", path: "/boutique" },
                { name: "Histoire", path: "/histoire" },
                { name: "Scanner", path: "/scan" },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-lg text-base ${isActive(link.path)} transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                      Connecté en tant que {user?.firstName}
                    </div>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
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
                      className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-center transition"
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
      <div className="h-16 md:h-20"></div>
    </>
  );
}
