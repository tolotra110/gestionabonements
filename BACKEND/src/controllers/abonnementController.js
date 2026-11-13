import { query } from '../config/db.js';

export const getAbonnements = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM abonnements ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAbonnement = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM abonnements WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAbonnement = async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const cols = keys.map((k) => `"${k}"`).join(', ');
    const { rows } = await query(
      `INSERT INTO abonnements (${cols}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAbonnement = async (req, res) => {
  try {
    const { id } = req.params;
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const { rows } = await query(
      `UPDATE abonnements SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAbonnement = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM abonnements WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.json({ message: 'Abonnement supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

