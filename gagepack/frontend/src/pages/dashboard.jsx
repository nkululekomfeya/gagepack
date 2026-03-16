export function Dashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Gauge Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Gauges" value="42" />
                <StatCard title="Due Soon" value="6" />
                <StatCard title="Overdue" value="2" />
                <StatCard title="Failed" value="1" />
            </div>
        </div>
    );
}


function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}