"use client";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // https://github.com/jquense/react-big-calendar
import MonthView from './customView.tsx'
import dynamic from "next/dynamic";
import { useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";

//Apparently we are using moment?
const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Some Class Event',
    start: new Date('2025-04-12T13:45:00-05:00'),
    end: new Date('2025-04-12T14:00:00-05:00')
  },
];

const calendarStyle = {
  backgroundColor: "#00000", // Light gray background
  borderRadius: "10px", // Rounded corners
  //padding: "10px",
  color: "black",
  border: "1px solid #ccc",
  height: 700
};

const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    backgroundColor: "#28a745", // Custom event color
    borderRadius: "5px",
    opacity: 0.8,
    color: "white",
    border: "1px solid #1e7e34",
    display: "block"
  };
  return { style };
};

const MyCalendar = () => {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());
  return <Calendar 
      key={JSON.stringify(events)} //Supposedly a work around to make sure the buttons on the calendar wor
      localizer={localizer} 
      events={events} 
      startAccessor="start" 
      endAccessor="end" 
      style={calendarStyle}
      eventPropGetter={eventStyleGetter} 
      view={view}
      onView={setView}
      date={date}
      onNavigate={setDate}
      views={{ month: true }}
      />;
};

// Export the calendar dynamically with SSR disabled
//const MyCalendar = dynamic(() => Promise.resolve(MyCalendarInner), {ssr: false});

export default MyCalendar;