import React from 'react';
import { Grid, Button, Typography, Container } from '@mui/material';

const Page = () => {
  // Static calendar for April 2025
  const daysInMonth = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ];

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">April 2025</Typography>
      <Grid container spacing={1} justifyContent="center">
        {daysInMonth.map((day, index) => {
          // If it's the first row (the day names)
          if (index < 7) {
            return (
              <Grid item xs={1.5} key={index}>
                <Button fullWidth sx={{ backgroundColor: 'lightgray', padding: '16px' }}>
                  {day}
                </Button>
              </Grid>
            );
          }

          // If it's a day of the month
          return (
            <Grid item xs={1.5} key={index}>
              <Button fullWidth sx={{ padding: '16px' }}>
                {day}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Page;
