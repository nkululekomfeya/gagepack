/*import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack
} from '@mui/material';

export default function CalibrationDialog({ open, onClose, gaugeId, gaugeType, onSuccess }) {
    const [form, setForm] = useState({
        calibration_date: '',
        result: 'PASS',
        performed_by: '',
        certificate_path: '',
        notes: ''
    });

    

    const [file, setFile] = useState(null);


    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        if (file) {
            formData.append('certificate', file);
        }

        const res = await fetch(
            `http://localhost:5000/api/calibrations/${gaugeId}`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!res.ok) {
            alert('Failed to save calibration');
            return;
        }

        onSuccess();
        onClose();
    }


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Calibration</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Calibration Date"
                        type="date"
                        name="calibration_date"
                        InputLabelProps={{ shrink: true }}
                        value={form.calibration_date}
                        onChange={handleChange}
                        fullWidth
                        required
                    />

                    <TextField
                        select
                        label="Result"
                        name="result"
                        value={form.result}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="PASS">PASS</MenuItem>
                        <MenuItem value="FAIL">FAIL</MenuItem>
                    </TextField>

                    <TextField
                        label="Performed By"
                        name="performed_by"
                        value={form.performed_by}
                        onChange={handleChange}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Certificate Path / URL"
                        name="certificate_path"
                        value={form.certificate_path}
                        onChange={handleChange}
                        fullWidth
                    />
                    {gaugeType === 'EXTERNAL' && (
                        <Button variant="outlined" component="label">
                            Upload Certificate
                            <input
                                type="file"
                                hidden
                                accept="application/pdf,image/*"
                                onChange={e => setFile(e.target.files[0])}
                            />
                        </Button>
                    )}

                    <TextField
                        label="Notes"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    Save Calibration
                </Button>
            </DialogActions>
        </Dialog>
    );
}
*/
/*import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

export default function CalibrationDialog({ open, onClose, gaugeId, onSuccess }) {
  const [calibrationDate, setCalibrationDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [result, setResult] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const results = [
        { value: 'PASS', label: 'Pass' },
        { value: 'FAIL', label: 'Fail' },
        { value: 'LIMIT', label: 'Limit' },
    ];

  const handleSubmit = async () => {
    if (!calibrationDate || !performedBy) {
      alert('Please fill required fields');
      return;
    }

    const formData = new FormData();
    formData.append('calibration_date', calibrationDate);
    formData.append('due_date', dueDate);
    formData.append('result', result);
    formData.append('performed_by', performedBy);
    formData.append('notes', notes);
    if (file) formData.append('certificate', file);

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/calibrations/${gaugeId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save calibration');

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Calibration save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Calibration</DialogTitle>
      <DialogContent>
        <TextField
          label="Calibration Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          margin="dense"
          value={calibrationDate}
          onChange={(e) => setCalibrationDate(e.target.value)}
        />
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          margin="dense"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
              <TextField
                  select
                  label="Result"
                  fullWidth
                  margin="dense"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
              >
                  {results.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))}
              </TextField>
        <TextField
          label="Performed By"
          fullWidth
          margin="dense"
          value={performedBy}
          onChange={(e) => setPerformedBy(e.target.value)}
        />
        <TextField
          label="Notes"
          fullWidth
          multiline
          rows={3}
          margin="dense"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Certificate (PDF)
        </Typography>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
*/
/*import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    MenuItem,
    TextField,
    Typography,
    Divider,
} from '@mui/material';

export default function CalibrationDialog({
    open,
    onClose,
    gaugeId,
    gaugeType, // 👈 NEW
    onSuccess,
}) {
    const [calibrationDate, setCalibrationDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [result, setResult] = useState('');
    const [performedBy, setPerformedBy] = useState('');
    const [notes, setNotes] = useState('');

    // INTERNAL ONLY
    const [masterGaugeNumber, setMasterGaugeNumber] = useState('');
    const [calibrationSteps, setCalibrationSteps] = useState('');

    // EXTERNAL ONLY
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const results = [
        { value: 'PASS', label: 'Pass' },
        { value: 'FAIL', label: 'Fail' },
        { value: 'LIMIT', label: 'Limit' },
    ];

    const isInternal = gaugeType === 'INTERNAL';
    const isExternal = gaugeType === 'EXTERNAL';

    const handleSubmit = async () => {
        if (!calibrationDate || !performedBy || !result) {
            alert('Please fill required fields');
            return;
        }

        if (isInternal && (!masterGaugeNumber || !calibrationSteps)) {
            alert('Please complete internal calibration details');
            return;
        }

        const formData = new FormData();
        formData.append('calibration_date', calibrationDate);
        formData.append('due_date', dueDate);
        formData.append('result', result);
        formData.append('performed_by', performedBy);
        formData.append('notes', notes);

        if (isInternal) {
            formData.append('master_gauge_number', masterGaugeNumber);
            formData.append('calibration_steps', calibrationSteps);
        }

        if (isExternal && file) {
            formData.append('certificate', file);
        }

        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:5000/api/calibrations/${gaugeId}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!res.ok) throw new Error('Failed to save calibration');

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Calibration save failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Calibration</DialogTitle>

            <DialogContent>
                {*//* COMMON FIELDS *//*}
                <TextField
                    label="Calibration Date"
                    type="date"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    value={calibrationDate}
                    onChange={(e) => setCalibrationDate(e.target.value)}
                />


                <TextField
                    label="Due Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="dense"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <TextField
                    select
                    label="Result"
                    fullWidth
                    margin="dense"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                >
                    {results.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>


                <TextField
                    label="Performed By"
                    fullWidth
                    margin="dense"
                    value={performedBy}
                    onChange={(e) => setPerformedBy(e.target.value)}
                />

                <TextField
                    label="Notes"
                    fullWidth
                    multiline
                    rows={3}
                    margin="dense"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                {*//* INTERNAL CALIBRATION SECTION *//*}
                {isInternal && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1">
                            Internal Calibration Details
                        </Typography>

                        <TextField
                            label="Master Gauge Number"
                            fullWidth
                            margin="dense"
                            value={masterGaugeNumber}
                            onChange={(e) => setMasterGaugeNumber(e.target.value)}
                        />

                        <TextField
                            label="Calibration Steps"
                            fullWidth
                            multiline
                            rows={6}
                            margin="dense"
                            value={calibrationSteps}
                            onChange={(e) => setCalibrationSteps(e.target.value)}
                        />


                        <Typography variant="caption" color="text.secondary">
                            A calibration certificate will be generated automatically.
                        </Typography>
                    </>
                )}

                {*//* EXTERNAL CALIBRATION SECTION *//*}
                {isExternal && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1">
                            External Certificate (PDF)
                        </Typography>

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
*/
import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    MenuItem,
    TextField,
    Typography,
    Box,
} from '@mui/material';

export default function CalibrationDialog({
    open,
    onClose,
    gaugeId,
    gaugeType,

    onSuccess,
}) {
    const isInternal = gaugeType === 'INTERNAL';
    const isExternal = gaugeType === 'EXTERNAL';

    const [calibrationDate, setCalibrationDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [result, setResult] = useState('');
    const [performedBy, setPerformedBy] = useState('');
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);

    // INTERNAL ONLY
    const [masterGaugeNumber, setMasterGaugeNumber] = useState('');
    const [calibrationSteps, setCalibrationSteps] = useState('');

    const [loading, setLoading] = useState(false);

    const results = [
        { value: 'PASS', label: 'Pass' },
        { value: 'FAIL', label: 'Fail' }
        
    ];
    
    const handleSubmit = async () => {
        if (!calibrationDate || !performedBy) {
            alert('Please fill required fields');
            return;
        }

        if (isInternal && (!masterGaugeNumber || !calibrationSteps)) {
            alert('Internal calibration requires master gauge and steps');
            return;
        }

        const formData = new FormData();
        formData.append('calibration_date', calibrationDate);
        formData.append('due_date', dueDate);
        formData.append('result', result);
        formData.append('performed_by', performedBy);
        formData.append('notes', notes);

        if (isExternal && file) {
            formData.append('certificate', file);
        }

        if (isInternal) {
            formData.append('master_gauge_number', masterGaugeNumber);
            // Before appending
            const stepsArray = calibrationSteps
                .split('\n')           // split by new line
                .map(line => line.trim())
                .filter(line => line); // remove empty lines

            formData.append('calibration_steps', JSON.stringify(stepsArray));


        }

        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:5000/api/calibrations/${gaugeId}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            console.log('Gauge Type:', gaugeType);

            if (!res.ok) throw new Error('Failed to save calibration');

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Calibration save failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Add Calibration ({isInternal ? 'This gauge is internal' : 'External Gauge'})
            </DialogTitle>

            <DialogContent>
                <TextField
                    label="Calibration Date"
                    type="date"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    value={calibrationDate}
                    onChange={(e) => setCalibrationDate(e.target.value)}
                />

                <TextField
                    label="Due Date"
                    type="date"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <TextField
                    select
                    label="Result"
                    fullWidth
                    margin="dense"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                >
                    {results.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Performed By"
                    fullWidth
                    margin="dense"
                    value={performedBy}
                    onChange={(e) => setPerformedBy(e.target.value)}
                />

                <TextField
                    label="Notes"
                    fullWidth
                    multiline
                    rows={3}
                    margin="dense"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                {/* INTERNAL GAUGE SECTION */}
                {isInternal && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">
                            Internal Calibration Details
                        </Typography>

                        <TextField
                            label="Master Gauge Number"
                            fullWidth
                            margin="dense"
                            value={masterGaugeNumber}
                            onChange={(e) => setMasterGaugeNumber(e.target.value)}
                        />

                        <TextField
                            label="Calibration Steps"
                            fullWidth
                            multiline
                            rows={6}
                            margin="dense"
                            value={calibrationSteps}
                            onChange={(e) => setCalibrationSteps(e.target.value)}
                            placeholder="Step 1: Zero gauge&#10;Step 2: Verify at 10mm..."
                        />
                    </Box>
                )}

                {/* EXTERNAL GAUGE SECTION */}
                {isExternal && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">
                            Calibration Certificate (PDF)
                        </Typography>

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </Box>
                )}
            </DialogContent>


            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
