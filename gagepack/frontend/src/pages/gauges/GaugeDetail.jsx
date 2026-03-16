//export function GaugeDetail() {
//    return (
//        <div className="p-6">
//            <div className="flex justify-between items-start">
//                <div>
//                    <h1 className="text-2xl font-bold">Gauge G-001</h1>
//                    <p className="text-gray-500">Pressure Gauge • External</p>
//                </div>
//                <QRCodeDisplay />
//            </div>


//            <div className="mt-6">
//                <h2 className="font-semibold mb-2">Calibration History</h2>
//                <CalibrationTable />
//            </div>
//        </div>
//    );
//}


//function QRCodeDisplay() {
//    return (
//        <div className="bg-white p-4 rounded-2xl shadow text-center">
//            <div className="w-24 h-24 bg-gray-200 mb-2" />
//            <p className="text-xs">Scan for details</p>
//        </div>
//    );
//}


//import { useEffect, useState } from 'react';
//import { useParams, Link } from 'react-router-dom';

//export default function GaugeDetail() {
//    const { id } = useParams();
//    const [data, setData] = useState(null);

//    useEffect(() => {
//        fetch(`http://localhost:5000/api/gauges/${id}`)
//            .then(res => res.json())
//            .then(setData);
//    }, [id]);

//    if (!data) return <p className="p-6">Loading…</p>;

//    const { gauge, calibrations } = data;

//    return (
//        <div className="p-6 space-y-6">
//            <Link to="/gauges" className="text-blue-600 underline">
//                ← Back to Gauges
//            </Link>

//            <div className="bg-white p-6 rounded shadow">
//                <h1 className="text-2xl font-bold">{gauge.gauge_code}</h1>
//                <p>{gauge.description}</p>
//                <p className="text-sm text-gray-500">
//                    {gauge.verification_type} • {gauge.gauge_type}
//                </p>
//            </div>

//            <div className="bg-white p-6 rounded shadow">
//                <h2 className="text-xl font-semibold mb-2">
//                    Calibration History
//                </h2>

//                {calibrations.length === 0 ? (
//                    <p>No calibrations recorded.</p>
//                ) : (
//                    <table className="min-w-full text-sm">
//                        <thead>
//                            <tr className="border-b">
//                                <th>Date</th>
//                                <th>Due</th>
//                                <th>Result</th>
//                                <th>Performed By</th>
//                            </tr>
//                        </thead>
//                        <tbody>
//                            {calibrations.map(c => (
//                                <tr key={c.id} className="border-b">
//                                    <td>{c.calibration_date}</td>
//                                    <td>{c.due_date}</td>
//                                    <td>{c.result}</td>
//                                    <td>{c.performed_by}</td>
//                                </tr>
//                            ))}
//                        </tbody>
//                    </table>
//                )}
//            </div>
//        </div>
//    );
//}
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalibrationDialog from '../../components/CalibrationDialog';


import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditDialog from '../../components/EditDialog';
import AppHeader from '../../components/AppHeader';

export default function GaugeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [calDialogOpen, setCalDialogOpen] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const [editOpen, setEditOpen] = useState(false);

    const [gauge, setGauge] = useState(null);
    const [calibrations, setCalibrations] = useState([]);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAllHistory, setShowAllHistory] = useState(false);
    const [showAllCalibrations, setShowAllCalibrations] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/api/gauges/${id}`)
            .then(res => res.json())
            .then(data => {
                setGauge(data.gauge);
                setCalibrations(data.calibrations || []);
                setMovements(data.movements || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading)
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6">Loading gauge...</Typography>
            </Container>
        );

    if (!gauge)
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6">Gauge not found</Typography>
            </Container>
        );

    const fetchGauge = async () => {
    try {
        const res = await fetch(
            `http://localhost:5000/api/gauges/${id}`
        );

        const data = await res.json();
        setGauge(data.gauge);
        setCalibrations(data.calibrations);
        setMovements(data.movements);
    } catch (err) {
        console.error('Fetch gauge failed', err);
    }
};


    function handleDelete() {
        if (!confirm('Delete this gauge?')) return;

        fetch(`http://localhost:5000/api/gauges/${id}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to delete');
                return res.json();
            })
            .then(() => navigate('/gauges'))
            .catch(err => {
                console.error(err);
                alert('Delete failed');
            });
    }

    const formatDate = dateStr =>
        dateStr ? new Date(dateStr).toLocaleDateString() : '—';


    const formatDateTime = dateStr =>
        dateStr ? new Date(dateStr).toLocaleString() : '—';


    




    return (
        <>
            <AppHeader title="Gauge Details" />

            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Stack direction="row" spacing={2} mb={3}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                    <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete Gauge
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => setCalDialogOpen(true)}
                    >
                        Add Calibration
                    </Button>
                    <Button variant="outlined" onClick={() => setEditOpen(true)}>
                      Edit Gauge
                    </Button>
                </Stack>

                 {/*Gauge Info*/} 
                <Card elevation={3} sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {gauge.gauge_code}
                        </Typography>
                        


  

                        <Stack spacing={1}>
                            <Typography>
                                <strong>Description:</strong> {gauge.description || '—'}
                            </Typography>
                            <Typography>
                                <strong>Type / Size:</strong> {gauge.gauge_type || '—'}
                            </Typography>
                            <Typography>
                                <strong>Status:</strong> {gauge.status || '—'}
                            </Typography>
                            <Typography>
                                <strong>Verification:</strong> {gauge.verification_type || '—'}
                            </Typography>
                            <Typography>
                                <strong>Base Location:</strong> {gauge.base_location || '—'}
                            </Typography>
                            <Typography>
                                <strong>Current Location:</strong> {gauge.current_location || '—'}
                            </Typography>
                            <Typography>
                                <strong>Last Calibration:</strong> {formatDate(gauge.last_calibration_date)}
                            </Typography>
                            <Typography>
                                <strong>Next Calibration:</strong> {formatDate(gauge.next_calibration_date)}
                            </Typography>
                            <Typography>
                                <strong>Calibration Frequency:</strong> {gauge.calibration_frequency_months} {gauge.calibration_frequency_months === 1 ? 'month' : 'months'}
                            </Typography>
                        </Stack>
                    </CardContent>

                <EditDialog
                  open={editOpen}
                  onClose={() => setEditOpen(false)}
                  gauge={gauge}
                  onUpdated={fetchGauge}
                />
                </Card>

                {/* Calibration History */}
                <Typography variant="h6" fontWeight="bold" mb={1}>
                    Calibration History
                </Typography>

                {calibrations.length === 0 ? (
                    <Typography>No calibration records</Typography>
                ) : (
                    <TableContainer component={Paper} elevation={2} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Due</TableCell>
                                    <TableCell>Result</TableCell>
                                    <TableCell>Performed By</TableCell>
                                    <TableCell>Certificate</TableCell>  
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {(showAllCalibrations
                              ? calibrations
                              : calibrations.slice(0, 2)
                            ).map((c) => (
                                  <>
        {console.log('CERT PATH:', c.certificate_path)}
<TableRow key={c.id}>
    <TableCell>
        {formatDate(c.calibration_date)}
    </TableCell>

    <TableCell>
        {formatDate(c.due_date)}
    </TableCell>

    <TableCell
        sx={{
            fontWeight: 'bold',
            color:
                c.result === 'PASS'
                    ? 'success.main'
                    : c.result === 'FAIL'
                        ? 'error.main'
                        : 'text.primary'
        }}
    >
        {c.result || '—'}
    </TableCell>


    <TableCell>
        {c.performed_by || '—'}
    </TableCell>
    

    <TableCell>
        {c.certificate_path ? (
            <a
                href={`http://localhost:5000${c.certificate_path}`}
                target="_blank"
                rel="noreferrer"
            >
                View
            </a>

        ) : '—'}
    </TableCell>

    <TableCell>
        {c.notes || '—'}
    </TableCell>
        </TableRow>
    </> 
                            ))}    
                            </TableBody>
                            {calibrations.length > 2 && (
  <Button
    size="small"
    onClick={() => setShowAllCalibrations(!showAllHistory)}
  >
    {showAllHistory ? 'Show Less' : 'Show More'}
  </Button>
)}
                        </Table>
                    </TableContainer>
                )}


                {/* Movements Table */}
                <Typography variant="h6" fontWeight="bold" mb={1}>
                    Gauge Movements
                </Typography>

                {movements.length === 0 ? (
                    <Typography>No movements recorded</Typography>
                ) : (
                    <TableContainer component={Paper} elevation={2}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date/Time</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>From</TableCell>
                                    <TableCell>To</TableCell>
                                    <TableCell>Technician</TableCell>
                                    <TableCell>Part Number</ TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {(showAllHistory ? movements : movements.slice(0, 5)).map((m) => (
                                     <TableRow key={m.id}>
                                        <TableCell>{formatDateTime(m.movement_date)}</TableCell>
                                        <TableCell>{m.movement_type}</TableCell>
                                        <TableCell>{m.from_location || '—'}</TableCell>
                                        <TableCell>{m.to_location}</TableCell>
                                        <TableCell>{m.technician}</TableCell>
                                        <TableCell>{m.part_number || '—'}</TableCell>
                                     
                                    </TableRow>
                                    
                                  
                                    
                                ))}                               
                            </TableBody>
                        </Table>
                        {movements.length > 5 && (
                                      <Button
                                        size="small"
                                        onClick={() => setShowAllHistory(!showAllHistory)}
                                      >
                                        {showAllHistory ? 'Show Less' : 'Show More'}
                                      </Button>
                                    )}
                    </TableContainer>
                )}

            </Container>
            <CalibrationDialog
                open={calDialogOpen}
                onClose={() => setCalDialogOpen(false)}
                gaugeId={id}
                gaugeType={gauge?.verification_type}
                onSuccess={fetchGauge}
            />

        </>
    );
}

