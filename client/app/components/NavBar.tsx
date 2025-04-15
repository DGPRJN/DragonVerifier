"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
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
} from "@mui/material";

// Header component
const Header = ({ toggleDrawer }: { toggleDrawer: (open: boolean) => () => void }) => {
  return (
    <Container maxWidth="lg" sx={{ bgcolor: "lightgray", px: 4, pt: 1 }}>
      <Button onClick={toggleDrawer(true)}>Open Menu</Button>
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        Random info idk man
      </Typography>
    </Container>
  );
};

// Drawer + Header wrapper
function NavBarContent() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Header toggleDrawer={toggleDrawer} />
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
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