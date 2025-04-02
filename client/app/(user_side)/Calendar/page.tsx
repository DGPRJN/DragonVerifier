"use client";
import React from 'react';
import Calendar from './calender.tsx'
import { Container } from '@mui/material';

const Page = () => {
  // Static calendar for April 2025

  return (

    <Container maxWidth="lg" disableGutters sx={{ bgcolor: "white", borderRadius: "10px" }}>
      <Calendar/>
    </Container>
  );
};

export default Page;
