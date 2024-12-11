# Plateforme d'Apprentissage en Ligne

Ce projet de plateforme d'apprentissage en ligne est conçu pour offrir une expérience d'apprentissage immersive, permettant aux utilisateurs d'accéder à divers cours en fonction de leurs rôles : **Administrateur**, **Formateur**, ou **Étudiant**.

## Fonctionnalités principales

### 1. **Panneau Administrateur**
   - Permet aux administrateurs de gérer les utilisateurs et les cours.
   - Fonctions incluent la **création** et la **suppression de cours**.

### 2. **Panneau Formateur**
   - Permet aux formateurs de **créer** et **gérer leurs cours**.
   - Interactions avec les étudiants pour faciliter l'apprentissage.

### 3. **Tableau de bord Étudiant**
   - Offre aux étudiants un accès direct aux **cours disponibles**.
   - Suivi de leurs **progrès** et gestion de leur apprentissage personnel.

### 4. **Authentification**
   - Utilisation de **JSON Web Tokens (JWT)** pour sécuriser l'accès à la plateforme.
   - Protéger les sessions et les données sensibles des utilisateurs.

### 5. **Fonctionnalité de Recherche**
   - Recherche de **cours** par critères variés tels que le **titre**, la **catégorie** ou l'**instructeur**.

### 6. **Conception Responsive**
   - Le **front-end** est développé avec **React.js**, garantissant une interface moderne, rapide et **responsive**.

## Architecture

### Back-End
Le back-end est construit avec **Node.js** et **MongoDB**, permettant de :
   - Gérer l'authentification des utilisateurs.
   - Gérer la **création** et la **gestion des cours**.
   - Assurer la communication sécurisée entre le front-end et le back-end.

### Front-End
Le front-end utilise **React.js** pour afficher une interface utilisateur fluide et intuitive, permettant une interaction facile avec la plateforme.

## Sécurité et Scalabilité
La plateforme est **sécurisée**, utilisant des pratiques modernes telles que l'authentification via JWT pour protéger les données utilisateurs. De plus, elle est conçue pour être **évolutive**, permettant d'ajouter facilement de nouvelles fonctionnalités au fil du temps.

## Conclusion
Cette plateforme d'apprentissage en ligne offre une **expérience d'apprentissage engageante** et sécurisée, adaptée à différents types d'utilisateurs, avec une interface moderne et responsive.

---

### Technologies utilisées

- **Frontend**: React.js
- **Backend**: Node.js, MongoDB
- **Authentification**: JWT

# Installation des Dépendances:

### Pour le front-end
cd frontend
npm install


### Pour le back-end
cd backend
npm install

# Lancement du Projet:

### Lancer le back-end
cd backend
npm run dev

### Lancer le front-end
cd frontend
npm start

# .env file:
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=123456
PORT=5000

# Admin Login:
firstName: "Admin"
lastName: "System"
email: "admin@admin.com"
password: "admin123456"


# Packages Installés dans le Front-End (React.js):

- @emotion/react - Version: 11.13.5 : `npm install @emotion/react@11.13.5`
- @emotion/styled - Version: 11.13.5 : `npm install @emotion/styled@11.13.5`
- @mui/icons-material - Version: 6.1.8 : `npm install @mui/icons-material@6.1.8`
- @mui/material - Version: 6.1.8 : `npm install @mui/material@6.1.8`
- @mui/x-data-grid - Version: 7.23.0 : `npm install @mui/x-data-grid@7.23.0`
- axios - Version: 1.7.8 : `npm install axios@1.7.8`
- framer-motion - Version: 11.11.17 : `npm install framer-motion@11.11.17`
- react-router-dom - Version: 7.0.1 : `npm install react-router-dom@7.0.1`
- react-scripts - Version: 5.0.1 : `npm install react-scripts@5.0.1`

# Packages Installés dans le Back-End (Node.js):

- bcryptjs - Version: 2.4.3 : `npm install bcryptjs@2.4.3`
- cors - Version: 2.8.5 : `npm install cors@2.8.5`
- dotenv - Version: 16.4.5 : `npm install dotenv@16.4.5`
- express - Version: 4.21.1 : `npm install express@4.21.1`
- jsonwebtoken - Version: 9.0.2 : `npm install jsonwebtoken@9.0.2`
- mongoose - Version: 8.8.3 : `npm install mongoose@8.8.3`
- nodemon - Version: 2.0.22 : `npm install nodemon@2.0.22`


# Arborescence (Tree) du Projet:

```plaintext
e-learning/
├── backend/
│   ├── config/
│   │   └── db.js                  # Configuration de la base de données
│   │
│   ├── middleware/
│   │   └── auth.js                # Middleware d'authentification
│   │
│   ├── models/                    # Schémas de la base de données
│   │   ├── Course.js              # Modèle de cours
│   │   └── User.js                # Modèle d'utilisateur
│   │
│   ├── routes/                    # Points d'entrée API
│   │   ├── auth.js                # Routes d'authentification
│   │   ├── courses.js             # Routes des cours
│   │   └── users.js               # Routes des utilisateurs
│   │
│   ├── scripts/
│   │   └── createAdmin.js         # Création d'utilisateur admin
│   │
│   ├── app.js
│   ├── .env                       # Variables d'environnement
│   ├── package.json               # Dépendances backend
│   └── server.js                  # Fichier principal du serveur
│
└── frontend/
    ├── public/
    │   └── index.html             # Page HTML d'entrée
    │
    └── src/
        ├── components/            # Composants réutilisables
        │   ├── CourseDetail.jsx   # Vue détaillée du cours
        │   ├── Home.jsx           # Page d'accueil
        │   ├── Login.jsx          # Formulaire de connexion
        │   ├── Navbar.jsx         # Navigation principale
        │   ├── ProtectedRoute.js  # Protection des routes
        │   ├── Signup.jsx         # Formulaire d'inscription
        │   ├── dashboards/        # Composants tableau de bord
        │   │   ├── DashboardNavbar.js   # Navigation du tableau de bord
        │   │   ├── admin/
        │   │   │   └── AdminDashboard.js # Panneau administrateur
        │   │   ├── instructor/
        │   │   │   ├── CreateCourse.js  # Création de cours
        │   │   │   └── InstructorDashboard.js # Tableau de bord formateur
        │   │   └── student/
        │   │       └── StudentDashboard.js # Vue étudiant
        │   └── search/           # Fonctionnalité de recherche
        │       ├── SearchCourses.jsx
        │       └── SearchResults.jsx
        ├── context/
        │   └── AuthContext.js    # Contexte d'authentification
        ├── App.js                # Composant React principal
        └── index.js              # Point d'entrée React




