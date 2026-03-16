/*import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

*//**
 * External calibration
 *//*
router.post('/external', async (req, res) => {
    const {
        gauge_id,
        calibration_date,
        due_date,
        performed_by,
        certificate_path,
        result,
    } = req.body;

    const calibration = await pool.query(
        `INSERT INTO calibrations (
      gauge_id,
      calibration_date,
      due_date,
      performed_by,
      certificate_path,
      result
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
        [
            gauge_id,
            calibration_date,
            due_date,
            performed_by,
            certificate_path,
            result,
        ]
    );

    res.status(201).json(calibration.rows[0]);
});

*//**
 * Internal calibration
 *//*
router.post('/internal', async (req, res) => {
    const {
        gauge_id,
        calibration_date,
        due_date,
        performed_by,
        result,
        master_gauge_number,
        target_value,
        actual_value,
        deviation,
    } = req.body;

    const calibration = await pool.query(
        `INSERT INTO calibrations (
      gauge_id,
      calibration_date,
      due_date,
      performed_by,
      result
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id`,
        [gauge_id, calibration_date, due_date, performed_by, result]
    );

    await pool.query(
        `INSERT INTO internal_calibration_details (
      calibration_id,
      master_gauge_number,
      target_value,
      actual_value,
      deviation
    )
    VALUES ($1,$2,$3,$4,$5)`,
        [
            calibration.rows[0].id,
            master_gauge_number,
            target_value,
            actual_value,
            deviation,
        ]
    );

    res.status(201).json({ success: true });
});

export default router;
*/

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/index.js';
import generateInternalCalibrationPDF from '../pdf/internal-calibration.js';


const router = express.Router();

/* ---------- multer setup ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/certificates'));
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

/* ---------- constants ---------- */
const allowedResults = ['PASS', 'FAIL', 'LIMIT'];


/* ---------- route ---------- */


router.post('/:gaugeId', upload.single('certificate'), async (req, res) => {
    const { gaugeId } = req.params;
    const {
        calibration_date,
        due_date,
        result,
        performed_by,
        notes,
        master_gauge_number,
        calibration_steps
    } = req.body;

    /* ---- validate enum ---- */
    if (result && !allowedResults.includes(result)) {
        return res.status(400).json({ error: 'Invalid calibration result' });
    }

    try {
        /* ---- fetch gauge ---- */
        const gaugeRes = await pool.query(
            'SELECT * FROM gauges WHERE id = $1',
            [gaugeId]
        );

        if (gaugeRes.rows.length === 0) {
            return res.status(404).json({ error: 'Gauge not found' });
        }

        const gauge = gaugeRes.rows[0];
        

        /* ---- insert calibration ---- */
        const insertRes = await pool.query(
            `
      INSERT INTO calibrations (
        gauge_id,
        calibration_date,
        due_date,
        result,
        performed_by,
        notes,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,NOW())
      RETURNING *
      `,
            [gaugeId, calibration_date, due_date, result, performed_by, notes]
        );

        const calibration = insertRes.rows[0];

        let certificatePath = null;

        /* ---- INTERNAL: generate PDF ---- */
        if (gauge.verification_type === 'INTERNAL') {
            const steps = JSON.parse(calibration_steps || '[]'); // now it's an array of strings

            const filename = `INT_CAL_${gauge.gauge_code}_${Date.now()}.pdf`;
            const pdfDir = path.resolve('uploads/certificates');

            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }

            const pdfPath = path.join(pdfDir, filename);

            await generateInternalCalibrationPDF({
                gauge,
                calibration: {
                    calibration_date,
                    due_date,
                    result,
                    performed_by,
                    master_gauge_number,
                    calibration_steps: steps
                },
                outputPath: pdfPath
            });

            certificatePath = `/uploads/certificates/${filename}`;
        }

        /* ---- EXTERNAL: uploaded PDF ---- */
        if (gauge.verification_type === 'EXTERNAL' && req.file) {
            console.log('External calibration - file uploaded:', req.file);
            certificatePath = `/uploads/certificates/${req.file.filename}`;
        }
        
        /* ---- update certificate path ---- */
        if (certificatePath) {
            await pool.query(
                'UPDATE calibrations SET certificate_path = $1 WHERE id = $2',
                [certificatePath, calibration.id]
            );
        }

        res.json({ ...calibration, certificate_path: certificatePath });

    } catch (err) {
        console.error('Calibration save error:', err);
        res.status(500).json({ error: 'Failed to save calibration' });
    }
});

export default router;
