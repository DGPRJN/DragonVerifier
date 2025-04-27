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
    const [qrLinkTimer, setQrLinkTimer] = useState(2);

    // Define room numbers for University Hall (uh)
    const uhRooms = [
        '1005', '1007', '1008', '1009', '1011',
        '2005', '2007', '2009', '2010', '2011', '2012', '2013',
        '2100', '3002', '3005', '3007', '3009', '3010', '3011',
        '3012', '3013', '3101', '4002', '4004', '4101',
        '5066', '5101', '5105'
    ];

    // Define room numbers for Cambell Hall (ch)
    const chRooms = ['301'];

    // Define room numbers for Heritage Hall (hhb)
    const hhbRooms = [
        '102', '104', '106', '121', '124', '125', '126', '202', '221', '224',
        '225', '226', '227', '334', '342', '402', '420', '422', '426', '432',
        '524', '526', '536', '549'
    ];

    const handleGradingSwitch = (event) => setEnableGrading(event.target.checked);
    const handleGeolocationToggle = (event) => setGeolocationEnabled(event.target.checked);

    const handleSave = async () => {
        const settings = {
            geolocationEnabled,
            enableGrading,
            buildingCode: geolocationEnabled ? getBuildingCode : null,
            roomNumber: geolocationEnabled ? getRoomNumber : null,
            qrLinkTimer: qrLinkTimer ?? undefined,
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
                    sx={{ padding: 1, pb: 2, pt: 2 }}
                    label="Starting Time"
                    type="time"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    sx={{ padding: 1, pb: 2, pt: 2 }}
                    label="Tardy Cutoff"
                    type="time"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    sx={{ padding: 1, pb: 2, pt: 2 }}
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
                    {/* Add margin space between FormLabel and QR code timer input */}
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            sx={{ padding: 1, maxWidth: 200 }}
                            label="Timer Duration (minutes)"
                            type="number"
                            value={qrLinkTimer}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                if (newValue >= 1 && newValue <= 60) {
                                    setQrLinkTimer(newValue);
                                } else if (newValue < 1) {
                                    setQrLinkTimer(1);  // Set to min value (1)
                                } else if (newValue > 60) {
                                    setQrLinkTimer(60); // Set to max value (60)
                                }
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">Max: 60</InputAdornment>,
                            }}
                            inputProps={{
                                min: 1,   // Minimum value
                                max: 60,  // Maximum value
                            }}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
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
                                <MenuItem value="ch">Cambell Hall</MenuItem>
                                <MenuItem value="uh">University Hall</MenuItem>
                                <MenuItem value="hhb">Heritage Hall</MenuItem>
                            </Select>
                        </FormControl>

                        {(getBuildingCode === 'uh' || getBuildingCode === 'ch' || getBuildingCode === 'hhb') && (
                            <FormControl fullWidth sx={{ padding: 1 }}>
                                <InputLabel>Room</InputLabel>
                                <Select
                                    value={getRoomNumber}
                                    onChange={(e) => setRoomNumber(e.target.value)}
                                    label="Room"
                                >
                                    {getBuildingCode === 'uh' &&
                                        uhRooms.map((room) => (
                                            <MenuItem key={room} value={room}>
                                                {room}
                                            </MenuItem>
                                        ))}
                                    {getBuildingCode === 'ch' &&
                                        chRooms.map((room) => (
                                            <MenuItem key={room} value={room}>
                                                {room}
                                            </MenuItem>
                                        ))}
                                    {getBuildingCode === 'hhb' &&
                                        hhbRooms.map((room) => (
                                            <MenuItem key={room} value={room}>
                                                {room}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        )}
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