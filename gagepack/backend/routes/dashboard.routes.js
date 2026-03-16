import express from 'express';
import pool from '../db/index.js';
const router = express.Router();

router.get('/calibration-summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE next_calibration_date < CURRENT_DATE) AS overdue,
        COUNT(*) FILTER (
          WHERE next_calibration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        ) AS due_soon,
        COUNT(*) FILTER (WHERE next_calibration_date > CURRENT_DATE + INTERVAL '30 days') AS in_calibration
      FROM gauges
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

router.get('/calibration-results', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        result,
        COUNT(*) as count
      FROM calibrations
      GROUP BY result
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

router.get('/movement-trend', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(movement_date, 'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM movements
      WHERE movement_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Movement trend error:', err);
    res.status(500).json({ error: 'Failed to fetch movement trend' });
  }
});

router.get('/compliance-rate', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE next_calibration_date >= CURRENT_DATE) AS compliant,
        COUNT(*) AS total
      FROM gauges
    `);

    const { compliant, total } = result.rows[0];
    
    const percentage = total > 0
      ? ((compliant / total) * 100).toFixed(1)
      : 0;

    res.json({ percentage, compliant, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch compliance rate' });
  }
});

router.get('/movement-types', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT movement_type, COUNT(*) AS count
      FROM movements
      GROUP BY movement_type
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movement types' });
  }
});

router.get('/top-moved', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT gauge_id, COUNT(*) AS movement_count
      FROM movements
      GROUP BY gauge_id
      ORDER BY movement_count DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top moved gauges' });
  }
});

export default router;