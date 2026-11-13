CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  telephone TEXT,
  abonnement TEXT,
  "Adresse" TEXT,
  observation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS abonnements (
  id BIGSERIAL PRIMARY KEY,
  client TEXT NOT NULL,
  type TEXT,
  prix TEXT,
  "dateDebut" TEXT,
  "dateFin" TEXT,
  offre TEXT,
  observation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abonnements_created_at ON abonnements(created_at DESC);