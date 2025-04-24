"use client";
import {
    InputAdornment, Box, Typography, Container, Switch, RadioGroup, FormControlLabel, Radio,
    FormGroup, Checkbox, FormControl, FormLabel, Select, MenuItem, InputLabel, TextField,
    Dialog, DialogTitle, DialogContent, Button
} from "@mui/material";
import Course_Settings from "@/app/components/Course_Settings"
import { useState } from "react";

const Page = () => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
<>
    {/* Trigger Button */}
    <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            Open Settings
        </Button>
    </Box>

    {/* Settings Dialog */}
    <Course_Settings open={open} onClose={handleClose} />
</>
    );
};

export default Page;