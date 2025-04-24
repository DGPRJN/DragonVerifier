import React, { useState } from 'react';
import {
    InputAdornment, Box, Container, Switch, FormControlLabel,
    FormGroup, Checkbox, FormControl, FormLabel, TextField,
    Dialog, DialogTitle, DialogContent, Select, MenuItem, InputLabel, DialogActions, Button
} from "@mui/material";

function Course_Settings({ open, onClose }) {
    const [enableGrading, setEnableGrading] = useState(false);
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');

    const handleGradingSwitch = (event) => setEnableGrading(event.target.checked);
    const handleGeolocationToggle = (event) => setGeolocationEnabled(event.target.checked);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <Container sx={{ mt: 2 }}>
                    {/* Time Fields */}
                    <TextField
                        sx={{ padding: 1, pb: 2, pt:2 }}
                        label="Starting Time"
                        type="time"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        sx={{ padding: 1, pb: 2, pt:2 }}
                        label="Tardy Cutoff"
                        type="time"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <TextField
                        sx={{ padding: 1, pb: 2, pt:2 }}
                        label="Absent Cutoff"
                        type="time"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    {/* Grading Switch */}
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={enableGrading}
                                    onChange={handleGradingSwitch}
                                />
                            }
                            label="Enable Grading"
                        />
                    </FormControl>

                    {enableGrading && (
                        <>
                            <TextField
                                sx={{ padding: 1 }}
                                label="Absent Percentage"
                                type="number"
                                variant="outlined"
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                            />
                            <TextField
                                sx={{ padding: 1 }}
                                label="Tardy Percentage"
                                type="number"
                                variant="outlined"
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                            />
                        </>
                    )}

                    {/* Checkbox Group */}
                    <FormGroup>
                        <FormLabel>Choose additional verification options</FormLabel>
                        <FormControlLabel control={<Checkbox />} label="Entry Slip" />
                        <FormControlLabel control={<Checkbox />} label="Exit Slip" />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={geolocationEnabled}
                                    onChange={handleGeolocationToggle}
                                />
                            }
                            label="Geolocation"
                        />
                    </FormGroup>

                    {/* Geolocation Dropdowns */}
                    {geolocationEnabled && (
                        <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ padding: 1 }}>
                                <InputLabel>Building</InputLabel>
                                <Select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    label="Building"
                                >
                                    <MenuItem value="Cambell Hall">Cambell Hall</MenuItem>
                                    <MenuItem value="University Hall">University Hall</MenuItem>
                                    <MenuItem value="Blount Hall">Blount Hall</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ padding: 1 }}>
                                <InputLabel>Room</InputLabel>
                                <Select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    label="Room"
                                >
                                    <MenuItem value="3000">3000</MenuItem>
                                    <MenuItem value="3500">3500</MenuItem>
                                    <MenuItem value="1008">1008</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </Container>
            </DialogContent>

<DialogActions>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="contained" onClick={() => {
        // Handle save logic here if needed
        onClose(); // Close after saving
    }}>
        Save
    </Button>
</DialogActions>
        </Dialog>
    );
}

export default Course_Settings;