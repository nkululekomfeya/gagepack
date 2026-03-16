app.get('/api/gauges/:id', async (req, res) => {
    const { id } = req.params;

    const gaugeResult = await pool.query(
        'SELECT * FROM gauges WHERE id = $1',
        [id]
    );

    if (gaugeResult.rows.length === 0) {
        return res.status(404).json({ message: 'Gauge not found' });
    }

    const calibrationResult = await pool.query(
        `
    SELECT *
    FROM calibrations
    WHERE gauge_id = $1
    ORDER BY calibration_date DESC
    `,
        [id]
    );

    res.json({
        gauge: gaugeResult.rows[0],
        calibrations: calibrationResult.rows
    });
});
