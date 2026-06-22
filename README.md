# BiblioTech

BiblioTech est une application web de gestion de bibliothèque personnelle. Elle permet de rechercher des livres via l'API Open Library, de les organiser en listes de lecture et de laisser des commentaires. Un système d'authentification JWT/MySQL personnalise l'expérience et un tableau de bord administrateur offre une vue de gestion des utilisateurs et des commentaires.

## Technologies

- JavaScript (ES Modules) — frontend & backend
- HTML / CSS (Mobile First, Flexbox/Grid)
- Node.js + Express 5
- MySQL 8 + mysql2
- Zod — validation partagée front/back
- JWT + bcrypt — authentification
- Vitest — tests unitaires (schémas Zod, middleware d'authentification)
- Open Library REST API — données livres (gratuite, sans clé)

## Structure du projet

```
bibliotech/
├── src/
│   ├── backend/
│   │   ├── server.js              # Point d'entrée Express
│   │   ├── db.js                  # Connexion MySQL
│   │   ├── routes/
│   │   │   ├── auth-routes.js
│   │   │   ├── books-routes.js
│   │   │   ├── lists-routes.js
│   │   │   ├── comments_routes.js
│   │   │   ├── admin-routes.js
│   │   │   └── user-routes.js
│   │   ├── middlewares/
│   │   │   ├── isAuthenticated.js
│   │   │   ├── isAdmin.js
│   │   │   ├── isListOwner.js
│   │   │   └── errorHandler.js
│   │   ├── controllers/           # Logique métier
│   │   └── models/                # Requêtes SQL
│   └── shared/
│       └── schemas/                # Schémas Zod partagés front/back (+ tests)
│           ├── user-schema.js
│           ├── list-schema.js
│           └── comment-schema.js
├── public/
│   ├── css/
│   ├── html/
│   ├── js/
│   │   ├── pages/                  # Logique par page (books, lists, admin, profil...)
│   │   ├── api/                    # Appels vers le backend
│   │   └── utils/                  # apiFetch, pagination, navbar
│   └── index.html
├── DB/
│   └── Bibliotech.sql              # Schéma de la base de données
├── test Postman/
│   └── biblioteck.postman_collection.json
├── .env                            # Ne pas commiter
├── .gitignore
└── package.json
```

## Lancer le projet

```bash
npm run dev
```

Serveur disponible sur `http://localhost:3023`

## Tests

```bash
npm test              

```

