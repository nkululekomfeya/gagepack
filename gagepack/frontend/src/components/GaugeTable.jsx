import { useNavigate } from 'react-router-dom';

export default function GaugeTable({ gauges }) {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100 text-left text-sm uppercase">
                    <tr>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Verification</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {gauges.map(gauge => (
                        <tr
                            key={gauge.id}
                            className="border-t hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/gauges/${gauge.id}`)}
                        >
                            <td className="px-4 py-2 font-mono text-blue-600">
                                {gauge.gauge_code}
                            </td>
                            <td className="px-4 py-2">{gauge.description}</td>
                            <td className="px-4 py-2">{gauge.gauge_type}</td>
                            <td className="px-4 py-2">{gauge.verification_type}</td>
                            <td className="px-4 py-2">{gauge.location_name || '—'}</td>
                            <td className="px-4 py-2">{gauge.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
