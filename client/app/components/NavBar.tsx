"use client";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import MenuIcon from '@mui/icons-material/Menu';
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
  Box
} from "@mui/material";

//this may be problematic
const HEADER_HEIGHT = 64;

// Header component
const Header = ({ toggleDrawer }: { toggleDrawer: (open: boolean) => () => void }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height:HEADER_HEIGHT,
        bgcolor: "lightgray",
        px: 4,
        pt: 1,
        pb: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 64,
        position: "relative",
        top: 0,
        left: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1, // place it above the drawer
      }}
    >
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          minWidth: 0,
          padding: 1,
          color: "black",
        }}
      >
        <MenuIcon fontSize="large" />
      </Button>
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Dragon Verifier
      </Typography>
        <Box sx={{ width: 40, height: 40, position: "relative" }}>
          <Image
            src="/assets/Dragon_Logo.png"
            alt="Dragon Logo"
            layout="fill"
            style={{ 
                objectFit: "contain",  // or "cover" if you want it to fill the container completely
                transform: "scale(2)", // <-- Zoom in
                transformOrigin: "center"
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
            mt: `${HEADER_HEIGHT}px`, // drawer appears below header
            height: `calc(100% - ${HEADER_HEIGHT}px)`,
          },
        }}
        ModalProps={{ hideBackdrop: true }}
      >
        <List>
          {[
            { text: "Home", href: "/" },
            { text: "Calendar", href: "/Calendar" },
            { text: "Courses", href: "/Classes" },
          ].map(({ text, href }) => (
            <ListItem key={`${href}-${text}`} disablePadding>
              <Link href={href} passHref legacyBehavior>
                <ListItemButton component="a" onClick={toggleDrawer(false)}>
                  <Typography>{text}</Typography>
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <Divider />
          <ListSubheader>More</ListSubheader>
          {[
            { text: "About Us", href: "/about" },
            { text: "Contacts", href: "/contact_us" },
            { text: "Login/Account", href: "/login" },
          ].map(({ text, href }) => (
            <ListItem key={href} disablePadding>
              <Link href={href} passHref legacyBehavior>
                <ListItemButton component="a" onClick={toggleDrawer(false)}>
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