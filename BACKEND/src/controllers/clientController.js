import { query } from '../config/db.js';

export const getClients = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM clients WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Client non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const cols = keys.map((k) => `"${k}"`).join(', ');
    const { rows } = await query(
      `INSERT INTO clients (${cols}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const { rows } = await query(
      `UPDATE clients SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Client non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM clients WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Client non trouvé' });
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

