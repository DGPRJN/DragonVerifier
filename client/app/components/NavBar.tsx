"use client";

import React from "react";
import Link from "next/link";
import { Drawer, Button, List, ListItem, ListItemButton, Typography } from "@mui/material";

export default function NavBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const menuList = (
    <List>
      {[
        { text: "Home", href: "/" },
        { text: "About Us", href: "/about" },
        { text: "Contacts", href: "/contact_us" },
        { text: "Login", href: "/login" },
      ].map(({ text, href }) => (
        <ListItem key={href} disablePadding>
          <Link href={href} passHref legacyBehavior>
            <ListItemButton component="a">
              <Typography>{text}</Typography>
            </ListItemButton>
          </Link>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      {/* Button to open the drawer */}
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>

      {/* Drawer Component */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {menuList}
      </Drawer>
    </>
  );
}
