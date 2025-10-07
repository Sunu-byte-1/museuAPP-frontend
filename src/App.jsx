import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { AdminProvider } from './context/AdminContext'
import { TicketProvider } from './context/TicketContext'

 /**
  * Composant racine de l'application.
  *
  * Empilement des contextes (Providers):
  * - UserProvider: gestion de l'authentification et profil utilisateur
  * - AdminProvider: gestion des œuvres et des statistiques d'administration
  * - TicketProvider: panier, billets et achats
  *
  * Routage:
  * - Déclare l'ensemble des pages publiques, utilisateur et admin.
  * - `BrowserRouter` encapsule la navigation côté client.
  */
// Components
import Header from './components/header'
import Footer from './components/footer'

// Pages
import Accueil from './pages/accueil'

// User pages
import UserLogin from './pages/user/UserLogin'
import ArtworkDetail from './pages/user/ArtworkDetail'
import PurchaseTicket from './pages/user/PurchaseTicket'
import Boutique from './pages/user/BoutiqueEnhanced'
import ScanArtwork from './pages/user/ScanArtworkEnhanced'
import VirtualVisit from './pages/user/VirtualVisitEnhanced'
import Histoire from './pages/Histoire'

// Admin pages
import AdminLogin from './pages/admin/adminLogin'
import AdminDashboard from './pages/admin/adminDashboard'
import AddArtwork from './pages/admin/AddArtwork'
import ArtworkList from './pages/admin/ArtworkList'

function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <TicketProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col transition-colors duration-500 bg-museum-light dark:bg-museum-dark">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Accueil />} />
                  <Route path="/billet" element={<PurchaseTicket />} />
                  <Route path="/boutique" element={<Boutique />} />
                  <Route path="/scan" element={<ScanArtwork />} />
                  <Route path="/visite-virtuelle/:id" element={<VirtualVisit />} />
                  <Route path="/histoire" element={<Histoire />} />
                  <Route path="/artwork/:id" element={<ArtworkDetail />} />
                  {/* User routes */}
                  <Route path="/login" element={<UserLogin />} />
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/artworks" element={<ArtworkList />} />
                  <Route path="/admin/add-artwork" element={<AddArtwork />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TicketProvider>
      </AdminProvider>
    </UserProvider>
  )
}

export default App
