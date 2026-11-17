# AnjomaCenter Backend

API REST Express/PostgreSQL. Supabase est utilisé comme hébergeur PostgreSQL ; l'application conserve sa propre authentification email/mot de passe dans la table `auth_users` (elle n'utilise pas Supabase Auth).

## Installation

```bash
npm install
```

## Configuration

Copier `BACKEND/.env.example` vers `BACKEND/.env`, puis renseigner :
```env
PORT=5000
DATABASE_URL=postgresql://postgres.PROJECT_REF:DATABASE_PASSWORD@POOLER_HOST:5432/postgres?sslmode=require
AUTH_TOKEN_SECRET=une-cle-aleatoire-d-au-moins-32-caracteres
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Dans Supabase, ouvrir **Connect** et utiliser l'URI du **Session pooler** (port `5432`), pratique notamment si le réseau ne prend pas en charge IPv6. Remplacer les valeurs d'exemple par l'URI fournie pour le projet ; encoder les caractères spéciaux du mot de passe dans l'URL. Ne jamais utiliser la clé `service_role` comme `DATABASE_URL` et ne jamais committer `.env`.

Générer une clé de session aléatoire avec Node.js :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Migrations

Appliquer les migrations sur le projet Supabase configuré :
```bash
npm run migrate
```

Les fichiers SQL sont dans `BACKEND/migrations/` et leur suivi se fait dans la table `schema_migrations`. Après migration, créer le premier compte privé (le mot de passe est saisi sans affichage) :
```bash
npm run auth:create-user
```

Ajouter l'URL de production du frontend à `CORS_ORIGINS`, puis lancer l'API :
```bash
npm start
```

En développement :
```bash
npm run dev
```

## Routes

- GET /api/clients
- GET /api/clients/:id
- POST /api/clients
- PUT /api/clients/:id
- DELETE /api/clients/:id

- GET /api/abonnements
- GET /api/abonnements/:id
- POST /api/abonnements
- PUT /api/abonnements/:id
- DELETE /api/abonnements/:id
