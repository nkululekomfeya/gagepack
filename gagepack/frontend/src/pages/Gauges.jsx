import { useEffect, useState } from 'react';
import { fetchGauges } from '../api/gauges';
import GaugeTable from '../components/GaugeTable';

export default function Gauges() {
    const [gauges, setGauges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGauges()
            .then(setGauges)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading gauges…</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gauges</h1>
            <GaugeTable gauges={gauges} />
        </div>
    );
}
