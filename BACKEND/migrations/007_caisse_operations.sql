CREATE TABLE IF NOT EXISTS caisse_operations (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('RECETTE', 'DEPENSE')),
  montant NUMERIC(12, 2) NOT NULL CHECK (montant > 0),
  date_operation DATE NOT NULL DEFAULT CURRENT_DATE,
  motif TEXT NOT NULL CHECK (length(trim(motif)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_caisse_operations_date
  ON caisse_operations(date_operation DESC, id DESC);
