# Musée des Arts et Culture - Application Web

Une application web moderne et interactive pour la gestion et la visite d'un musée, développée avec React et Vite.

## 🎨 Fonctionnalités

### Pour les visiteurs
- **Page d'accueil** avec présentation des œuvres en vedette
- **Achat de billets** en ligne avec différents types (adulte, étudiant, enfant, senior, famille, pass annuel)
- **Scanner QR** pour obtenir des informations détaillées sur les œuvres
- **Visite virtuelle** interactive avec contrôles de zoom, rotation et audio
- **Détails des œuvres** avec descriptions, audio-guides et informations complètes
- **Système d'authentification** pour les utilisateurs

### Pour les administrateurs
- **Tableau de bord** avec statistiques et métriques
- **Gestion des œuvres** (ajout, modification, suppression, activation/désactivation)
- **Gestion des utilisateurs** et des billets
- **Interface d'administration** complète et intuitive

### Fonctionnalités techniques
- **Mode sombre/clair** avec persistance des préférences
- **Multilingue** (Français, Anglais, Espagnol, Wolof)
- **Responsive design** pour tous les appareils
- **Gestion d'état** avec React Context
- **Navigation** fluide avec React Router
- **Interface moderne** avec Tailwind CSS

## 🚀 Technologies utilisées

- **React 19** - Framework JavaScript
- **Vite** - Build tool et serveur de développement
- **React Router DOM** - Navigation
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Icônes
- **Context API** - Gestion d'état

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd museeLast
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── header.jsx      # En-tête avec navigation
│   └── footer.jsx      # Pied de page
├── context/            # Contextes React
│   ├── UserContext.jsx     # Gestion des utilisateurs
│   ├── AdminContext.jsx    # Gestion des œuvres
│   └── TicketContext.jsx   # Gestion des billets
├── data/               # Données JSON
│   ├── artworks.json       # Catalogue des œuvres
│   ├── tickets.json        # Types de billets
│   ├── users.json          # Utilisateurs
│   └── translations.json   # Traductions
├── pages/              # Pages de l'application
│   ├── accueil.jsx         # Page d'accueil
│   ├── user/               # Pages utilisateur
│   │   ├── UserLogin.jsx
│   │   ├── ArtworkDetail.jsx
│   │   ├── PurchaseTicket.jsx
│   │   ├── ScanArtwork.jsx
│   │   └── VirtualVisit.jsx
│   └── admin/              # Pages administrateur
│       ├── adminLogin.jsx
│       ├── adminDashboard.jsx
│       ├── AddArtwork.jsx
│       └── ArtworkList.jsx
├── App.jsx             # Composant principal
├── App.css             # Styles globaux
└── main.jsx            # Point d'entrée
```

## 🔐 Comptes de test

### Administrateur
- **Email:** admin@musee.com
- **Mot de passe:** admin123

### Utilisateur
- **Email:** user@example.com
- **Mot de passe:** user123

## 🎯 Routes disponibles

### Public
- `/` - Page d'accueil
- `/billet` - Achat de billets
- `/boutique` - Boutique (redirige vers billets)
- `/scan` - Scanner QR
- `/artwork/:id` - Détails d'une œuvre
- `/visite-virtuelle/:id` - Visite virtuelle

### Utilisateur
- `/login` - Connexion utilisateur

### Administrateur
- `/admin/login` - Connexion admin
- `/admin/dashboard` - Tableau de bord
- `/admin/artworks` - Liste des œuvres
- `/admin/add-artwork` - Ajouter une œuvre

## 🎨 Personnalisation

### Couleurs
Les couleurs peuvent être personnalisées dans `tailwind.config.js` :
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Vos couleurs primaires */ },
      secondary: { /* Vos couleurs secondaires */ }
    }
  }
}
```

### Traductions
Ajoutez de nouvelles langues dans `src/data/translations.json` :
```json
{
  "votre-langue": {
    "nav": { /* Traductions de navigation */ },
    "home": { /* Traductions de l'accueil */ }
  }
}
```

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les écrans :
- **Mobile** (< 768px)
- **Tablet** (768px - 1024px)
- **Desktop** (> 1024px)

## 🌙 Mode sombre

Le mode sombre est automatiquement détecté selon les préférences système et peut être basculé manuellement via le bouton dans l'en-tête.

## 🔧 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build
npm run lint     # Linting ESLint
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, contactez-nous :
- **Email:** contact@musee.com
- **Téléphone:** +33 1 23 45 67 89

---

Développé avec ❤️ pour l'art et la culture