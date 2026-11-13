# AnjomaCenter Backend

API REST avec Express et PostgreSQL (Supabase direct).

## Installation

```bash
npm install
```

## Configuration

Configurer `BACKEND/.env` :
```env
PORT=5000
DATABASE_URL=postgresql://postgres:...@db.vtometzuixpbuwppzajr.supabase.co:5432/postgres
```

## Migrations

Appliquer les migrations vers Supabase/Postgres :
```bash
npm run migrate
```

Les fichiers SQL sont dans `BACKEND/migrations/` et le suivi se fait dans la table `schema_migrations`.

## Lancer le serveur

```bash
npm run dev
npm start
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
