# AnjomaCenter

Application de gestion des clients, abonnements et opérations de caisse. Supabase héberge la base PostgreSQL ; l'application utilise sa propre authentification email/mot de passe et ne dépend pas de Supabase Auth.

## Préparer Supabase

1. Dans Supabase, ouvrez **Connect** et copiez l'URI du **Session pooler** (port `5432`). Ce mode fonctionne aussi sur les réseaux sans IPv6.
2. Dans un terminal PowerShell, à la racine du projet, créez le fichier d'environnement backend s'il n'existe pas déjà :

   ```powershell
   Set-Location BACKEND
   if (!(Test-Path .env)) { Copy-Item .env.example .env }
   ```

3. Ouvrez `BACKEND/.env` et remplacez `DATABASE_URL` par l'URI copiée depuis Supabase. Encodez les caractères spéciaux du mot de passe dans l'URL. Ne mettez jamais la clé `service_role` dans `DATABASE_URL`.
4. Remplacez `AUTH_TOKEN_SECRET` par une clé aléatoire d'au moins 32 caractères. Vous pouvez en générer une avec Node.js :

   ```powershell
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

   Gardez `.env` privé : il est ignoré par Git et ne doit jamais être commité.

## Installer et lancer

Dans `BACKEND` :

```powershell
npm install
npm run migrate
npm run auth:create-user
npm run dev
```

Les migrations créent les tables nécessaires sur Supabase. `auth:create-user` demande l'adresse email et un mot de passe d'au moins 12 caractères, saisi sans affichage. Cette commande sert à créer ou réinitialiser un compte autorisé ; aucune inscription publique n'est disponible.

Dans un second terminal, à la racine du projet :

```powershell
Set-Location FRONTEND/anjomacenter
npm install
npm run dev
```

Ouvrez l'adresse locale affichée par Vite, généralement `http://localhost:5173`, puis connectez-vous avec le compte créé. L'API écoute par défaut sur `http://localhost:5000`. Pour un déploiement, configurez l'URL du frontend dans `CORS_ORIGINS` du backend.

Pour les détails des variables d'environnement et des scripts backend, voir [BACKEND/README.md](BACKEND/README.md).
