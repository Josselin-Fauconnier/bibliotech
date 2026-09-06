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



## Lancer le projet

```bash
npm run dev
```

Serveur disponible sur `http://localhost:3023`

## Tests

```bash
npm test              

```

