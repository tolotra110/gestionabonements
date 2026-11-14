import { query } from '../config/db.js';

const METHODES = ['Espèces', 'Mobile Money', 'Virement', 'Chèque'];

const SELECT_PAIEMENTS = `
  SELECT p.*,
         a.client,
         a.numero_abonnement,
         a.offre,
         a.prix AS prix_abonnement
  FROM paiements p
  JOIN abonnements a ON a.id = p.abonnement_id
`;

const montantPrix = (prix) => Number(String(prix ?? '').replace(/[^\d.-]/g, '')) || 0;

export const getPaiements = async (req, res) => {
  try {
    const { rows } = await query(`${SELECT_PAIEMENTS} ORDER BY p.date_paiement DESC, p.id DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaiementsAbonnement = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `${SELECT_PAIEMENTS} WHERE p.abonnement_id = $1 ORDER BY p.date_paiement ASC, p.id ASC`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPaiement = async (req, res) => {
  try {
    const abonnement_id = Number(req.body.abonnement_id);
    const montant = Number(req.body.montant);

    if (!Number.isInteger(abonnement_id) || abonnement_id <= 0) {
      return res.status(400).json({ message: 'Abonnement invalide' });
    }
    if (!Number.isFinite(montant) || montant <= 0) {
      return res.status(400).json({ message: 'Le montant doit être supérieur à 0' });
    }

    const methode = req.body.methode ?? 'Espèces';
    if (!METHODES.includes(methode)) {
      return res.status(400).json({ message: `Méthode de paiement inconnue : ${methode}` });
    }

    const abonnement = await query('SELECT * FROM abonnements WHERE id = $1', [abonnement_id]);
    if (abonnement.rows.length === 0) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    const dejaPaye = await query(
      'SELECT COALESCE(SUM(montant), 0) AS total FROM paiements WHERE abonnement_id = $1',
      [abonnement_id]
    );
    const total = Number(dejaPaye.rows[0].total);
    const prix = montantPrix(abonnement.rows[0].prix);
    const reste = prix - total;

    if (montant > reste) {
      return res.status(400).json({
        message: `Le montant dépasse le reste à payer (${reste.toLocaleString('fr-FR')})`,
      });
    }

    const datePaiement = req.body.date_paiement || null;

    const { rows } = await query(
      `INSERT INTO paiements (abonnement_id, montant, date_paiement, methode, note)
       VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE), $4, $5)
       RETURNING *`,
      [abonnement_id, montant, datePaiement, methode, req.body.note ?? null]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePaiement = async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM paiements WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.json({ message: 'Paiement supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
