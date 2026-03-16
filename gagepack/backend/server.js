import express from 'express';
import cors from 'cors';

import gaugesRoutes from './routes/gauges.routes.js';
import calibrationsRoutes from './routes/calibrations.routes.js';
import movementsRoutes from './routes/movements.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import pool from './db/index.js';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/gauges', gaugesRoutes);
app.use('/api/calibrations', calibrationsRoutes);
app.use('/api/movements', movementsRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* -------------------------
   CREATE GAUGE
-------------------------- */

app.post('/api/gauges', async (req, res) => {
    try {
        // 1️⃣ Destructure body first
        const {
            gauge_code,
            description,
            gauge_type,
            verification_type,
            status,
            base_location,
            current_location,
            last_calibration_date,
            calibration_frequency_months
        } = req.body;

        // 2️⃣ Default current location to base if empty
        const actualCurrentLocation = current_location || base_location;

        // 3️⃣ Calculate next calibration date
        const lastDate = new Date(last_calibration_date);
        const nextCalibration = new Date(lastDate);
        nextCalibration.setMonth(
            lastDate.getMonth() + Number(calibration_frequency_months)
        );

        // 4️⃣ Insert into DB
        const result = await pool.query(
            `
            INSERT INTO gauges (
                gauge_code,
                description,
                gauge_type,
                verification_type,
                status,
                base_location,
                current_location,
                last_calibration_date,
                calibration_frequency_months,
                next_calibration_date
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *
            `,
            [
                gauge_code,
                description,
                gauge_type,
                verification_type,
                status,
                base_location,
                actualCurrentLocation,
                last_calibration_date,
                calibration_frequency_months,
                nextCalibration
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting gauge:', err);
        res.status(400).json({ error: err.message });
    }
});


/* -------------------------
   DELETE GAUGE  ✅ MOVED HERE
-------------------------- */
app.delete('/api/gauges/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM gauges WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Gauge not found' });
        }

        res.json({ deleted: true, id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete gauge' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/uploads', express.static('uploads'));

