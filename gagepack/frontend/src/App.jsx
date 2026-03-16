import { useEffect, useState } from 'react';
import GaugeTable from './components/GaugeTable';
import { Routes, Route, Navigate } from 'react-router-dom';
import GaugeList from './pages/gauges/GaugeList';
import GaugeDetail from './pages/gauges/GaugeDetail';
import AddGauge from './pages/gauges/AddGauge';
import Dashboard from './pages/dashboard/Dashboard';

export default function App() {
  const [gauges, setGauges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/gauges')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched gauges:', data);
        setGauges(data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load');
      });
  }, []);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/gauges" />} />
            <Route path="/gauges" element={<GaugeList />} />
            <Route path="/gauges/new" element={<AddGauge />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/gauges/:id" element={<GaugeDetail />}

            />
      </Routes>
  );
}

