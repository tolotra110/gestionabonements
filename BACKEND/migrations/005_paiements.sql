CREATE TABLE IF NOT EXISTS paiements (
  id BIGSERIAL PRIMARY KEY,
  abonnement_id BIGINT NOT NULL REFERENCES abonnements(id) ON DELETE CASCADE,
  montant NUMERIC(12, 2) NOT NULL CHECK (montant > 0),
  date_paiement DATE NOT NULL DEFAULT CURRENT_DATE,
  methode TEXT NOT NULL DEFAULT 'Espèces',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paiements_abonnement ON paiements(abonnement_id);
CREATE INDEX IF NOT EXISTS idx_paiements_date ON paiements(date_paiement DESC);

-- Reprise des données existantes : chaque abonnement déjà enregistré
-- devient un paiement unique à sa date de début.
INSERT INTO paiements (abonnement_id, montant, date_paiement, methode, note)
SELECT
  a.id,
  REPLACE(REGEXP_REPLACE(a.prix, '[^0-9]', '', 'g'), '', '0')::NUMERIC,
  CASE
    WHEN a."dateDebut" ~ '^\d{2}/\d{2}/\d{4}$' THEN TO_DATE(a."dateDebut", 'DD/MM/YYYY')
    ELSE a.created_at::DATE
  END,
  'Espèces',
  'Paiement initial (reprise des données)'
FROM abonnements a
WHERE REGEXP_REPLACE(COALESCE(a.prix, ''), '[^0-9]', '', 'g') <> ''
  AND REPLACE(REGEXP_REPLACE(a.prix, '[^0-9]', '', 'g'), '', '0')::NUMERIC > 0
  AND NOT EXISTS (SELECT 1 FROM paiements p WHERE p.abonnement_id = a.id);
