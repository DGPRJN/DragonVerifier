import React, { useState } from 'react';
import {
    InputAdornment, Box, Container, Switch, FormControlLabel,
    FormGroup, Checkbox, FormControl, FormLabel, TextField,
    Dialog, DialogTitle, DialogContent, Select, MenuItem, InputLabel, Button
} from "@mui/material";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function Course_Settings({ open, onClose, courseId }) {
    const [enableGrading, setEnableGrading] = useState(false);
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [getBuildingCode, setBuildingCode] = useState('');
    const [getRoomNumber, setRoomNumber] = useState('');

    const handleGradingSwitch = (event) => setEnableGrading(event.target.checked);
    const handleGeolocationToggle = (event) => setGeolocationEnabled(event.target.checked);

    const handleSave = async () => {
        const settings = {
            geolocationEnabled,
            enableGrading,
            buildingCode: geolocationEnabled ? getBuildingCode : null,
            roomNumber: geolocationEnabled ? getRoomNumber : null,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}/settings`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Failed to save settings:", errorData);
            } else {
                const data = await res.json();
                console.log("Course settings updated:", data);
                onClose(); // Close dialog after successful save
            }
        } catch (err) {
            console.error("Error saving course settings:", err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <Container sx={{ mt: 2 }}>
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

                    {geolocationEnabled && (
                        <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ padding: 1 }}>
                                <InputLabel>Building</InputLabel>
                                <Select
                                    value={getBuildingCode}
                                    onChange={(e) => setBuildingCode(e.target.value)}
                                    label="Building"
                                >
                                    <MenuItem value="Cambell Hall">Cambell Hall</MenuItem>
                                    <MenuItem value="University Hall">University Hall</MenuItem>
                                    <MenuItem value="Heritage Hall">Heritage Hall</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ padding: 1 }}>
                                <InputLabel>Room</InputLabel>
                                <Select
                                    value={getRoomNumber}
                                    onChange={(e) => setRoomNumber(e.target.value)}
                                    label="Room"
                                >
                                    <MenuItem value="3000">2000</MenuItem>
                                    <MenuItem value="3500">3500</MenuItem>
                                    <MenuItem value="1008">1008</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}

                    <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Save Settings
                        </Button>
                    </Box>
                </Container>
            </DialogContent>
        </Dialog>
    );
}

export default Course_Settings;
