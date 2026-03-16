import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import AppHeader from '../../components/AppHeader';
const API_BASE = 'http://localhost:5000';

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [results, setResults] = useState([]);
  const [movementTrend, setMovementTrend] = useState([]);
  const [compliance, setCompliance] = useState({});
  const [topMoved, setTopMoved] = useState([]);
  const [movementTypes, setMovementTypes] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
  fetch('/api/dashboard/compliance-rate')
    .then(res => res.json())
    .then(setCompliance);

  fetch('/api/dashboard/movement-types')
    .then(res => res.json())
    .then(setMovementTypes);

  fetch('/api/dashboard/top-moved')
    .then(res => res.json())
    .then(setTopMoved);

  fetch('/api/dashboard/technician-activity')
    .then(res => res.json())
    .then(setTechnicians);
}, []);


  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard/calibration-summary`)
      .then(res => res.json())
      .then(setSummary);

    fetch(`${API_BASE}/api/dashboard/calibration-results`)
      .then(res => res.json())
      .then(setResults);

    fetch(`${API_BASE}/api/dashboard/movement-trend`)
      .then(res => res.json())
      .then(setMovementTrend);
  }, []);

  return (
      <>
      <AppHeader title="Analytics" />

      <Paper sx={{ p: 3, backgroundColor: '#111', color: '#fff' }}>
          <Typography variant="subtitle2">COMPLIANCE</Typography>
          <Typography variant="h3">
            {compliance.percentage || 0}%
          </Typography>
      </Paper>

      <Pie
          data={movementTypes}
          dataKey="count"
          nameKey="movement_type"
        />

        <BarChart data={technicians}>
          <XAxis dataKey="technician" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Gauge ID</TableCell>
              <TableCell>Movements</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topMoved.map(g => (
              <TableRow key={g.gauge_id}>
                <TableCell>{g.gauge_id}</TableCell>
                <TableCell>{g.movement_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

    <Grid maxWidth="lg" sx={{ mt: 4 }} container spacing={3}>

      {/* Summary Cards */}
      <Grid item xs={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Overdue</Typography>
          <Typography variant="h4">{summary.overdue || 0}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Due Soon</Typography>
          <Typography variant="h4">{summary.due_soon || 0}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">In Calibration</Typography>
          <Typography variant="h4">{summary.in_calibration || 0}</Typography>
        </Paper>
      </Grid>

      {/* Pass / Fail Pie Chart */}
      <Grid item xs={6}>
        <Paper sx={{ p: 2, height: 300 }}>
          <Typography variant="h6">Calibration Results</Typography>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={results}
                dataKey="count"
                nameKey="result"
                outerRadius={80}
              >
                {results.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Movement Trend */}
      <Grid item xs={6}>
        <Paper sx={{ p: 2, height: 300 }}>
          <Typography variant="h6">Movement Trend</Typography>
          <ResponsiveContainer>
            <LineChart data={movementTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

    </Grid>
    </>
  );
}




