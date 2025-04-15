"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Drawer,
  Button,
  List,
  ListItem,
  ListItemButton,
  Typography,
  ListSubheader,
  Divider,
} from "@mui/material";

const header = () => {
    return (
    <>
      <Container maxWidth="lg" sx={{ bgcolor: "lightgray", px: 4, pt: 1 }}>
      <Button onClick={toggleDrawer(true)}>Open Menu</Button>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Random info idk man
        </Typography>
      </Container>
    </>
  );
}

// Prevents Next.js from rendering NavBar on the server
const NavBar = dynamic(() => Promise.resolve(NavBarContent), { ssr: false });

function NavBarContent() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>

      </header>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
 <List>
    {[
      { text: "Home", href: "/" },
      { text: "Calendar", href: "/Calendar" },
      { text: "Courses", href: "/Classes" },
    ].map(({ text, href }) => (
      <ListItem key={`${href}-${text}`} disablePadding>
        <Link href={href} passHref legacyBehavior>
          <ListItemButton component="a" onClick ={toggleDrawer(false)}>
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

export default NavBar;