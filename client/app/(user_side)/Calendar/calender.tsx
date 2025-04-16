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
//This is all just for demo
type Event = {
  title: string;
  start: Date;
  end: Date;
};

    function generateRecurringEvents({
      title,
      startDate,
      endDate,
      startTime, // "10:00"
      endTime,   // "11:00"
      days = "MWF", // "MWF" or "TTh"
      count = 10,
    }: {
      title: string;
      startDate: Date;
      endDate: Date;
      startTime: string;
      endTime: string;
      days: "MWF" | "TTh";
      count: number;
    }): Event[] {
      const dayMap = {
        MWF: [1, 3, 5], // Monday, Wednesday, Friday
        TTh: [2, 4],    // Tuesday, Thursday
      };

      const allowedDays = dayMap[days];
      const events: Event[] = [];

      const current = new Date(startDate);

      while (current <= endDate && events.length < count) {
        if (allowedDays.includes(current.getDay())) {
          const [startHour, startMin] = startTime.split(":").map(Number);
          const [endHour, endMin] = endTime.split(":").map(Number);

          const eventStart = new Date(current);
          eventStart.setHours(startHour, startMin, 0, 0);

          const eventEnd = new Date(current);
          eventEnd.setHours(endHour, endMin, 0, 0);

          events.push({
            title,
            start: new Date(eventStart),
            end: new Date(eventEnd),
          });
        }

        // Move to the next day
        current.setDate(current.getDate() + 1);
      }

      return events;
    }

const events = [
  ...generateRecurringEvents({
    title: "CS 499 Capstone",
    startDate: new Date("2025-01-13"),
    endDate: new Date("2025-05-01"),
    startTime: "10:10",
    endTime: "11:00",
    days: "MWF",
    count: 300,
  }),
  ...generateRecurringEvents({
    title: "CS 301 Algorithms",
    startDate: new Date("2025-01-13"),
    endDate: new Date("2025-05-01"),
    startTime: "13:00",
    endTime: "14:15",
    days: "TTh",
    count: 300,
  }),
  ...generateRecurringEvents({
    title: "CS 210 Systems",
    startDate: new Date("2025-01-13"),
    endDate: new Date("2025-05-01"),
    startTime: "08:30",
    endTime: "09:45",
    days: "MWF",
    count: 300,
  }),
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