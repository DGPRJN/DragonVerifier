// page.tsx
"use client";

import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useLiveFeedLoader } from "./status";

export const Page = () => {
    const [messages, setMessages] = useState<any[]>([]);

    useLiveFeedLoader(setMessages);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Live Check-in Attempts
            </Typography>
            <List>
                {messages.map((msg, idx) => (
                    <ListItem key={idx}>
                        <ListItemText
                            primary={`Location: (${msg.latitude}, ${msg.longitude})`}
                            secondary={`Status: ${
                                msg.success ? "✅ Success" : "❌ Failed"
                            } at ${new Date(msg.timestamp).toLocaleString()}`}
                        />
                        <ListItemText>
                            User: Id: {msg.canvasUser.id}, Name: {msg.canvasUser.name}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Page;
