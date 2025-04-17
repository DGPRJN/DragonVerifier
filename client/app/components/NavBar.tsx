"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import {
    Container,
    Drawer,
    Button,
    List,
    ListItem,
    ListItemButton,
    Typography,
    ListSubheader,
    Divider,
    Box,
} from "@mui/material";
import { useAuth } from "../hooks/auth-provider";

//this may be problematic
const HEADER_HEIGHT = "6vh";

function getPage(): string {
    const location = useLocation();
    return location.pathname;
}

// Header component
const Header = ({
    toggleDrawer,
}: {
    toggleDrawer: (open: boolean) => () => void;
}) => {
    //Finds the Current Page
    const getPage = () => {
        const page = usePathname();

        // Handle root path as a special case
        if (page === "/") return "Home";
        if (page === "/contact_us") return "Contact Us";

        // Convert "/calendar" -> "Calendar", "/user/profile" -> "User / Profile"
        return page
            .split("/")
            .filter(Boolean)
            .map(
                (segment) =>
                    segment.charAt(0).toUpperCase() +
                    segment.slice(1).toLowerCase()
            )
            .join(" / ");
    };

    const auth = useAuth();

    const user = auth.user;

    return (
        <Box
            sx={{
                width: "100%",
                height: HEADER_HEIGHT,
                bgcolor: "lightgray",
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: HEADER_HEIGHT,
                position: "relative",
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1, // place it above the drawer
            }}
        >
            {/*For Button and page Title*/}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    px: 1,
                }}
            >
                <Button
                    onClick={toggleDrawer(true)}
                    sx={{
                        minWidth: 0,
                        color: "black",
                    }}
                >
                    <MenuIcon fontSize="large" />
                </Button>
                <Typography
                    variant="h7"
                    color="black"
                    sx={{ px: 1, textTransform: "none" }}
                >
                    {getPage()}
                </Typography>
            </Box>
            <Typography
                variant="h3"
                sx={{
                    textAlign: "center",
                    color: "black",
                    fontSize: {
                        xs: "1.5rem", // mobile
                        sm: "2rem", // tablets
                        md: "2.5rem", // small desktops
                        lg: "3rem", // large screens
                    },
                }}
            ></Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: "100%",
                    pr: 2, // <-- optional: adds right padding
                }}
            >
                <Typography>{user && "Hello, " + user.name}</Typography>
                <Image
                    src="/assets/Dragon_Logo.png"
                    alt="Dragon Logo"
                    width={0}
                    height={0}
                    sizes="(max-width: 600px) 30px, 40px"
                    style={{
                        width: "auto",
                        height: "95%", // fills most of the container height
                    }}
                />
            </Box>
        </Box>
    );
};

// Drawer + Header wrapper
function NavBarContent() {
    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen((prevOpen) => !prevOpen); // Toggle the drawer state
    };

    return (
        <>
            <Header toggleDrawer={toggleDrawer} />
            <Drawer
                anchor="left"
                open={open}
                onClose={() => toggleDrawer(false)} // ensure this closes the drawer
                PaperProps={{
                    sx: {
                        mt: HEADER_HEIGHT, // drawer appears below header
                        height: `calc(100% - ${HEADER_HEIGHT})`,
                    },
                }}
                ModalProps={{ hideBackdrop: true }}
            >
                <List>
                    {[
                        { text: "Home", href: "/" },
                        { text: "Calendar", href: "/Calendar" },
                        { text: "Classes", href: "/Classes" },
                    ].map(({ text, href }) => (
                        <ListItem key={`${href}-${text}`} disablePadding>
                            <Link href={href} passHref legacyBehavior>
                                <ListItemButton
                                    component="a"
                                    onClick={toggleDrawer(false)}
                                >
                                    <Typography>{text}</Typography>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                    <Divider />
                    <ListSubheader>More</ListSubheader>
                    {[
                        { text: "About Us", href: "/about" },
                        { text: "Contact Us", href: "/contact_us" },
                        { text: "Login/Account", href: "/login" },
                    ].map(({ text, href }) => (
                        <ListItem key={href} disablePadding>
                            <Link href={href} passHref legacyBehavior>
                                <ListItemButton
                                    component="a"
                                    onClick={toggleDrawer(false)}
                                >
                                    <Typography>{text}</Typography>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}

// Export with dynamic import if needed
export default dynamic(() => Promise.resolve(NavBarContent), { ssr: false });
