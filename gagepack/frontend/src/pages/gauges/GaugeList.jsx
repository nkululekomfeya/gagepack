import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';

import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // check OUT
import LoginIcon from '@mui/icons-material/Login';         // check IN

import AppHeader from '../../components/AppHeader';
import CheckOutDialog from '../../components/CheckOutDialog';

export default function GaugeList() {
    const [gauges, setGauges] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/gauges')
            .then(res => res.json())
            .then(data => {
                setGauges(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    

    return (
        <>
            <AppHeader title="Gauge Management System" />

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                        All Active Gauges
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/gauges/new')}
                    >
                        Add Gauge
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={6}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} elevation={2}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Gauge Code</b></TableCell>
                                    <TableCell><b>Size</b></TableCell>
                                    <TableCell><b>Base Location</b></TableCell>
                                    <TableCell><b>Current Location</b></TableCell>
                                    <TableCell><b>Next Calibration</b></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {gauges.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No gauges found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    gauges.map(gauge => (
                                        <GaugeRow
                                            key={gauge.id}
                                            gauge={gauge}
                                            onOpen={() => navigate(`/gauges/${gauge.id}`)}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </>
    );
}

/* -------------------------
   Gauge Row Component
-------------------------- */
function GaugeRow({ gauge, onOpen }) {
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const isCheckedOut =
        gauge.current_location &&
        gauge.base_location &&
        gauge.current_location !== gauge.base_location;

    const pulseRed = keyframes`
  0% {
    background-color: rgba(255, 0, 0, 0.05);
  }
  50% {
    background-color: rgba(255, 0, 0, 0.2);
  }
  100% {
    background-color: rgba(255, 0, 0, 0.05);
  }
`;

    const getCalibrationStatus = (nextDate) => {
        if (!nextDate) return 'normal';

        const today = new Date();
        const next = new Date(nextDate);

        today.setHours(0,0,0,0);
        next.setHours(0,0,0,0);

        const diffDays = (next - today) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) return 'overdue';
        if (diffDays <= 30) return 'due';

        return 'normal';
    };
      const status = getCalibrationStatus(gauge.next_calibration_date);

    return (
        <TableRow
            hover
            onClick={onOpen}
            sx={{
                cursor: 'pointer',
                backgroundColor:
                    status === 'due'
                        ? 'rgba(255, 193, 7, 0.15)'
                        : undefined,
                animation:
                    status === 'overdue'
                        ? `${pulseRed} 2s infinite`
                        : 'none'
            }}
        >
            {/* Gauge code + action icon */}
            <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                    <strong>{gauge.gauge_code}</strong>

                    {/* CHECK OUT */}
                    {!isCheckedOut && (
                        <Tooltip title="Check out gauge">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation(); // 🔑 prevents navigation
                                    setCheckoutOpen(true);
                                }}
                            >
                                <ExitToAppIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* CHECK IN */}
                    {isCheckedOut && (
                        <Tooltip title={`Check in gauge`}>
                            <IconButton
                                size="small"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const technician = prompt("Enter technician name:");
                                    if (!technician) return;

                                    try {
                                        const res = await fetch(`http://localhost:5000/api/gauges/${gauge.id}/checkin`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ technician, part_number: null })
                                        });
                                        if (!res.ok) throw new Error('Check-in failed');

                                        // Reload the page or refetch gauges
                                        window.location.reload();
                                    } catch (err) {
                                        alert(err.message);
                                    }
                                }}
                            >
                                <LoginIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}



                    <CheckOutDialog
                        open={checkoutOpen}
                        gauge={gauge}
                        onClose={() => setCheckoutOpen(false)}
                        onSuccess={() => window.location.reload()}
                    />
                </Box>
            </TableCell>

            <TableCell>{gauge.gauge_type || '—'}</TableCell>
            <TableCell>{gauge.base_location || '—'}</TableCell>
            <TableCell>{gauge.current_location || '—'}</TableCell>
            <TableCell>
                {gauge.next_calibration_date
                    ? new Date(gauge.next_calibration_date).toLocaleDateString()
                    : '—'}
            </TableCell>
        </TableRow>
    );
}
