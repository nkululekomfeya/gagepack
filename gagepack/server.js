import express from 'express';
import cors from 'cors';

import gaugesRoutes from './routes/gauges.routes.js';
import calibrationsRoutes from './routes/calibrations.routes.js';
import movementsRoutes from './routes/movements.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/gauges', gaugesRoutes);
app.use('/api/calibrations', calibrationsRoutes);
app.use('/api/movements', movementsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
