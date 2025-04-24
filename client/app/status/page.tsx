"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
} from "@mui/material";
import { useLiveFeedLoader } from "./status";
import router from "next/router";

export const Page = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const checkRole = async () => {
            try {
                const roleResponse = await fetch(`${API_BASE_URL}/api/v1/oauth/whoami`, {
                    credentials: "include",
                });

                if (!roleResponse.ok) {
                    throw new Error("Failed to fetch user role");
                }

                const roleData = await roleResponse.json();
                if (roleData.role !== "Instructor") {
                    window.location.href = `/`;
                }
            } catch (err) {
                console.error("Failed to fetch user role", err);
                window.location.href = `/`;
            }
        };

        checkRole();
    }, []);

    useLiveFeedLoader(setMessages);

    return (
        <Box sx={{ p: 2, maxWidth: 800, mx: "auto" }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Live Check-in Attempts
                </Typography>
                <List>
                    {messages.map((msg, idx) => (
                        <ListItem key={idx} alignItems="flex-start">
                            <ListItemText
                                primary={`Location: (${msg.latitude}, ${msg.longitude})`}
                                secondary={`Status: ${
                                    msg.success ? "✅ Success" : "❌ Failed"
                                } at ${new Date(msg.timestamp).toLocaleString()}`}
                            />
                            <ListItemText
                                secondary={`Name: ${msg.canvasUser.name}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};


export default Page;
