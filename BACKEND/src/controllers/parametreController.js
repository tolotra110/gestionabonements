import { query } from '../config/db.js';

const CHAMPS_MODIFIABLES = [
  'nom_zone',
  'adresse',
  'telephone',
  'email',
  'devise',
  'duree_abonnement_jours',
];

export const getParametres = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM parametres WHERE id = 1');
    if (rows.length === 0) return res.status(404).json({ message: 'Paramètres non trouvés' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateParametres = async (req, res) => {
  try {
    const keys = Object.keys(req.body).filter((k) => CHAMPS_MODIFIABLES.includes(k));
    if (keys.length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide à mettre à jour' });
    }

    const duree = req.body.duree_abonnement_jours;
    if (keys.includes('duree_abonnement_jours')) {
      const valeur = Number(duree);
      if (!Number.isInteger(valeur) || valeur < 1 || valeur > 3650) {
        return res.status(400).json({ message: "La durée d'abonnement doit être un entier entre 1 et 3650 jours" });
      }
      req.body.duree_abonnement_jours = valeur;
    }

    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = keys.map((k) => req.body[k]);

    const { rows } = await query(
      `UPDATE parametres SET ${setClause}, updated_at = NOW() WHERE id = 1 RETURNING *`,
      values
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Paramètres non trouvés' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
