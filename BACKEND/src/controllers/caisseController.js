import { query } from '../config/db.js';

const TYPES_OPERATION = ['RECETTE', 'DEPENSE'];

export const getOperationsCaisse = async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT id, source_id, type, montant, date_operation, motif, source, client
      FROM (
        SELECT
          'paiement-' || p.id::TEXT AS id,
          p.id AS source_id,
          'RECETTE'::TEXT AS type,
          p.montant,
          p.date_paiement AS date_operation,
          COALESCE(
            NULLIF(BTRIM(p.note), ''),
            'Paiement abonnement ' ||
              COALESCE(NULLIF(a.numero_abonnement, ''), '#' || a.id::TEXT) ||
              ' · ' || COALESCE(a.client, 'Client inconnu')
          ) AS motif,
          'paiement'::TEXT AS source,
          a.client
        FROM paiements p
        JOIN abonnements a ON a.id = p.abonnement_id

        UNION ALL

        SELECT
          'operation-' || c.id::TEXT AS id,
          c.id AS source_id,
          c.type,
          c.montant,
          c.date_operation,
          c.motif,
          'caisse'::TEXT AS source,
          NULL::TEXT AS client
        FROM caisse_operations c
      ) AS operations
      ORDER BY date_operation DESC, source_id DESC
    `);
    res.json(rows.map((operation) => ({
      ...operation,
      source_id: Number(operation.source_id),
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOperationCaisse = async (req, res) => {
  try {
    const { type, date_operation, motif } = req.body;
    const montant = Number(req.body.montant);

    if (!TYPES_OPERATION.includes(type)) {
      return res.status(400).json({ message: 'Type d’opération invalide' });
    }
    if (!Number.isFinite(montant) || montant <= 0 || montant > 9999999999.99) {
      return res.status(400).json({ message: 'Le montant doit être supérieur à 0 et inférieur à 10 milliards' });
    }
    const dateValide =
      typeof date_operation === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(date_operation) &&
      !Number.isNaN(new Date(`${date_operation}T00:00:00.000Z`).getTime()) &&
      new Date(`${date_operation}T00:00:00.000Z`).toISOString().slice(0, 10) === date_operation;
    if (!dateValide) {
      return res.status(400).json({ message: 'Date invalide' });
    }
    if (typeof motif !== 'string' || !motif.trim() || motif.trim().length > 300) {
      return res.status(400).json({ message: 'Le motif est obligatoire (300 caractères maximum)' });
    }

    const { rows } = await query(
      `INSERT INTO caisse_operations (type, montant, date_operation, motif)
       VALUES ($1, $2, $3::DATE, $4)
       RETURNING id, type, montant, date_operation, motif`,
      [type, montant, date_operation, motif.trim()]
    );
    const operation = rows[0];
    res.status(201).json({
      ...operation,
      id: `operation-${operation.id}`,
      source_id: Number(operation.id),
      source: 'caisse',
      client: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOperationCaisse = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Identifiant d’opération invalide' });
    }

    const { type, date_operation, motif } = req.body;
    const montant = Number(req.body.montant);
    if (!TYPES_OPERATION.includes(type)) {
      return res.status(400).json({ message: 'Type d’opération invalide' });
    }
    if (!Number.isFinite(montant) || montant <= 0 || montant > 9999999999.99) {
      return res.status(400).json({ message: 'Le montant doit être supérieur à 0 et inférieur à 10 milliards' });
    }
    const dateValide =
      typeof date_operation === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(date_operation) &&
      !Number.isNaN(new Date(`${date_operation}T00:00:00.000Z`).getTime()) &&
      new Date(`${date_operation}T00:00:00.000Z`).toISOString().slice(0, 10) === date_operation;
    if (!dateValide) {
      return res.status(400).json({ message: 'Date invalide' });
    }
    if (typeof motif !== 'string' || !motif.trim() || motif.trim().length > 300) {
      return res.status(400).json({ message: 'Le motif est obligatoire (300 caractères maximum)' });
    }

    const { rows } = await query(
      `UPDATE caisse_operations
       SET type = $2, montant = $3, date_operation = $4::DATE, motif = $5
       WHERE id = $1
       RETURNING id, type, montant, date_operation, motif`,
      [id, type, montant, date_operation, motif.trim()]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Opération non trouvée' });
    }
    const operation = rows[0];
    res.json({
      ...operation,
      id: `operation-${operation.id}`,
      source_id: Number(operation.id),
      source: 'caisse',
      client: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOperationCaisse = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Identifiant d’opération invalide' });
    }

    const { rowCount } = await query('DELETE FROM caisse_operations WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Opération non trouvée' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
