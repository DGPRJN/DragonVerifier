"use client";

import { ClickAwayListener } from "@mui/material";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import React, { createContext, useContext, useState } from "react";

// Inspiration taken from https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

const rootApi = `${process.env.NEXT_PUBLIC_BACKEND_LOCAL}/api/v1`;
const localStorage = typeof window !== "undefined" ? window.localStorage : null;

export const AuthContext = createContext<{
    user: User | null;
    token: string;
    loginAction: () => void;
    redirectAction: () => void;
    logoutAction: () => void;
}>({
    user: null,
    token: "",
    loginAction: () => {},
    redirectAction: () => {},
    logoutAction: () => {},
});

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>(
        localStorage?.getItem("token") || ""
    );

    const loginAction = async () => {
        try {
            // try to get the login url so we can redirect to canvas
            const response = await axios.get(`${rootApi}/oauth/login`);
            if (response.status == 200 && response.data.success == true) {
                window.location = response.data.redirect;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error(err); // TODO: make this snackbar
        }
    };

    const redirectAction = async () => {
        try {
            const response = await axios.get(`${rootApi}/oauth/whoami`, {
                withCredentials: true,
            });
            if (response.status == 200 && response.data.success == true) {
                const data = response.data;
                const canvasUser = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.primary_email,
                    canvasId: data.user.id,
                    profile_image_url: "",
                } as User;

                setUser(canvasUser);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const logoutAction = async () => {
        try {
            const response = await axios.post(
                `${rootApi}/oauth/logout`,
                {},
                { withCredentials: true }
            );
            if (response.status == 200 && response.data.success == true) {
                setUser(null);
                window.location = "/" as any;
                return;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loginAction, redirectAction, logoutAction }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};

export interface User {
    id: number;
    name: string;
    email: string;
    canvasId: number;
    profile_image_url: string;
}
