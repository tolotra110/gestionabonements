INSERT INTO clients (nom)
SELECT abonnements_manquants.nom
FROM (
  SELECT DISTINCT ON (LOWER(BTRIM(a.client)))
    BTRIM(a.client) AS nom
  FROM abonnements a
  WHERE NULLIF(BTRIM(a.client), '') IS NOT NULL
  ORDER BY LOWER(BTRIM(a.client)), a.id
) AS abonnements_manquants
WHERE NOT EXISTS (
  SELECT 1
  FROM clients c
  WHERE LOWER(BTRIM(c.nom)) = LOWER(abonnements_manquants.nom)
);

CREATE OR REPLACE FUNCTION sync_abonnement_client_to_clients()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  client_nom TEXT := NULLIF(BTRIM(NEW.client), '');
BEGIN
  IF client_nom IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(LOWER(client_nom))::BIGINT);

  INSERT INTO clients (nom)
  SELECT client_nom
  WHERE NOT EXISTS (
    SELECT 1
    FROM clients c
    WHERE LOWER(BTRIM(c.nom)) = LOWER(client_nom)
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS abonnements_sync_client ON abonnements;
CREATE TRIGGER abonnements_sync_client
AFTER INSERT OR UPDATE OF client ON abonnements
FOR EACH ROW
EXECUTE FUNCTION sync_abonnement_client_to_clients();
