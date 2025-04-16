"use client";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rootApi = `${process.env.NEXT_PUBLIC_BACKEND_LOCAL}/api/v1`;

export default function Page() {
    const queryParams = useSearchParams();
    const router = useRouter();
    const [user, setUser] = useState<User>(() => ({
        id: 0,
        name: "",
        email: "",
        time_zone: "",
    }));
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const success = queryParams.get("success");

    const handleClick = async () => {
        setLoading(true);

        axios
            .get(`${rootApi}/oauth/whoami`, { withCredentials: true })
            .then((res) => {
                setLoading(false);

                setUser({
                    id: res.data[1].id,
                    name: res.data[1].name,
                    email: res.data[1].primary_email,
                    time_zone: res.data[1].time_zone,
                });

                setLoaded(true);
            });
    };

    const clickLogout = async () => {
        setLoading(true);

        axios.get(`${rootApi}/oauth/logout`, { withCredentials: true });

        router.push("/login");
    };

    // TODO: here we will look for "redirect to" query

    if (success == "true")
        return (
            <Box
                display="flex"
                flexDirection="column"
                p="1em"
                gap="1em"
                alignItems="center"
            >
                <Alert severity="success">Successfully logged in!</Alert>
                <Typography>
                    Click here to load user info from Canvas!
                </Typography>
                <Button variant="contained" onClick={handleClick}>
                    Load
                </Button>
                {loading && <CircularProgress />}
                {loaded && <UserInfo user={user} />}
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clickLogout}
                >
                    Logout
                </Button>
            </Box>
        );

    return <Alert severity="error">Something went wrong...</Alert>;
}

function UserInfo({ user }: { user: User }) {
    return (
        <Box>
            <Typography>Id: {user.id}</Typography>
            <Typography>Name: {user.name}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Time Zone: {user.time_zone}</Typography>
        </Box>
    );
}

interface User {
    id: number;
    name: string;
    email: string;
    time_zone: string;
}
