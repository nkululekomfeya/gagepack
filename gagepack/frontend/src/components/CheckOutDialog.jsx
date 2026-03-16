import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';

export default function CheckOutDialog({ open, onClose, gauge, onSuccess }) {
    const [toLocation, setToLocation] = useState('');
    const [technician, setTechnician] = useState('');
    const [partNumber, setPartNumber] = useState('');
    const [saving, setSaving] = useState(false);

    function handleSubmit() {
        setSaving(true);

        fetch('http://localhost:5000/api/movements/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gauge_id: gauge.id,
                to_location: toLocation,
                technician,
                part_number: partNumber || null,
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error('Checkout failed');
                return res.json();
            })
            .then(() => {
                onSuccess();
                onClose();
            })
            .catch(err => {
                console.error(err);
                alert('Checkout failed');
            })
            .finally(() => setSaving(false));
    }

    return (
        <Dialog open={open}
            onClose={onClose}
            onClick={(e) => e.stopPropagation()}
            PaperProps={{
                onClick: (e) => e.stopPropagation(),
            }} fullWidth>
            <DialogTitle>
                Check Out Gauge – {gauge.gauge_code}
            </DialogTitle>

            <DialogContent>
                <TextField
                    label="New Location"
                    fullWidth
                    margin="dense"
                    value={toLocation}
                    onChange={e => setToLocation(e.target.value)}
                />

                <TextField
                    label="Technician"
                    fullWidth
                    margin="dense"
                    value={technician}
                    onChange={e => setTechnician(e.target.value)}
                />

                <TextField
                    label="Part Number (optional)"
                    fullWidth
                    margin="dense"
                    value={partNumber}
                    onChange={e => setPartNumber(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    Check Out
                </Button>
            </DialogActions>
        </Dialog>
    );
}
