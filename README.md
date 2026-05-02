# BiblioTech

BiblioTech est une application web de gestion de bibliothèque personnelle. Elle permet de rechercher des livres via l'API Open Library, de les organiser en listes de lecture et de laisser des commentaires. Un système d'authentification JWT/MySQL personnalise l'expérience et un tableau de bord administrateur offre une vue statistique de la plateforme.

## Technologies

- TypeScript (strict mode) — frontend & backend
- HTML / CSS (Mobile First, Flexbox/Grid)
- Node.js + Express 5
- MySQL 8 + mysql2
- Zod — validation partagée front/back
- JWT + bcrypt — authentification
- Open Library REST API — données livres (gratuite, sans clé)

## Structure du projet

```
bibliotech/
├── src/
│   ├── backend/
│   │   ├── server.ts              # Point d'entrée Express
│   │   ├── db.ts                  # Connexion MySQL
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── lists.routes.ts
│   │   │   ├── comments.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── middlewares/
│   │   │   ├── isAuthenticated.ts
│   │   │   └── isAdmin.ts
│   │   ├── controllers/           # Logique métier
│   │   └── models/                # Requêtes SQL
│   ├── frontend/
│   │   ├── pages/
│   │   │   ├── index.ts           # Accueil
│   │   │   ├── books.ts           # Liste livres
│   │   │   ├── detail.ts          # Fiche livre
│   │   │   ├── lists.ts           # Mes listes
│   │   │   └── admin.ts           # Dashboard admin
│   │   └── api/
│   │       └── openLibrary.ts     # Appels API externe
│   └── shared/
│       └── schemas/               # Schémas Zod partagés front/back
│           ├── user.schema.ts
│           ├── list.schema.ts
│           └── comment.schema.ts
├── public/
│   ├── css/
│   └── html/
├── .env                           # Ne pas commiter
├── .gitignore
├── tsconfig.json
└── package.json
```
