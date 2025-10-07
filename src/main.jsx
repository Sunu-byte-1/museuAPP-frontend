/**
 * Point d'entrée de l'application React.
 *
 * Responsabilités:
 * - Charger les styles globaux (`index.css`).
 * - Choisir le thème (clair/sombre) au plus tôt pour éviter le "flash".
 * - Monter l'application racine `App` dans l'élément #root.
 */
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// -------------------------------------------------------------
// Initialisation du thème (dark/light) AVANT le rendu de React
// -------------------------------------------------------------
// Objectif: appliquer la classe CSS `dark` sur <html> si l'utilisateur
// l'a déjà choisie, sinon suivre la préférence système. Placé avant
// le rendu pour supprimer au maximum le changement visuel tardif.
// Initialize theme early based on saved preference or system setting
try {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  const root = document.documentElement;
  if (useDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
} catch (_) {
  // ignore access errors (e.g., SSR or privacy mode)
}

// ---------------------------------
// Montage de l'application React
// ---------------------------------
// `StrictMode` active des vérifications supplémentaires en développement.
// `createRoot` (React 18+) initialise le rendu concurrent.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)