//Calendar.js
import React, {useState} from 'react';
import { 
  Calendar as BigCalendar,
  dateFnsLocalizer,
  CalendarProps
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import DatePicker from 'react-datepicker';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

//css files
import 'react-big-calendar/lib/css/react-big-calendar.css';
require('./Calendar.css')


const locales = {
  'en-CA': require('date-fns/locale/en-CA'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
}); 

const getDayOfWeek = dayAbbr => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  // Handle full names just in case (e.g., 'Monday') and short names ('Mon')
  const d = dayAbbr.toLowerCase().slice(0, 3);
  return days.indexOf(d);
};

const MyCalendar = ({ courses = [], assignments = [], height = "700px" }) => {
  // Map course schedules to events
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = event => {
    setSelectedEvent(event);
  };
  
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  
  // Create a map of course colors for easy lookup
  const courseColors = {};
  courses.forEach(c => {
      courseColors[c._id] = c.color;
  });

  // Generate Course Events
  let events = courses.flatMap(course => {
    const courseEvents = [];
    if (!course.schedules) return [];

    course.schedules.forEach(schedule => {
      const startDate = new Date(course.startDate);
      const endDate = new Date(course.endDate);
      let currentDate = startDate;
      
      // Parse days (e.g. "Mon, Wed" or "Monday")
      const days = schedule.day ? schedule.day.split(',').map(d => d.trim()) : [];
      const targetDayIndices = days.map(getDayOfWeek).filter(idx => idx !== -1);

      while (currentDate <= endDate) {
        const scheduleDay = new Date(currentDate);
        scheduleDay.setHours(0, 0, 0, 0);

        if (targetDayIndices.includes(scheduleDay.getDay())) {
          const startTimeParts = schedule.startTime.split(':').map(part => parseInt(part, 10));
          const endTimeParts = schedule.endTime.split(':').map(part => parseInt(part, 10));

          const startDateTime = new Date(scheduleDay);
          startDateTime.setHours(startTimeParts[0], startTimeParts[1]);

          const endDateTime = new Date(scheduleDay);
          endDateTime.setHours(endTimeParts[0], endTimeParts[1]);

          courseEvents.push({
            id: `${course._id}_${startDateTime.getTime()}`,
            title: course.name,
            start: startDateTime,
            end: endDateTime,
            type: 'course',
            desc: `Class: ${course.name} (${course.professor})`,
            color: course.color || '#8b5cf6' // Use course color or default violet
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return courseEvents;
  });

  // Generate Assignment Events
  if (assignments && assignments.length > 0) {
    const assignmentEvents = assignments.map((assignment) => {
      const duedate = new Date(assignment.dueDate);
      
      return {
        id: assignment._id,
        title: `DUE: ${assignment.name}`,
        start: duedate,
        end: duedate,
        allDay: true,
        type: 'assignment',
        desc: `Assignment Due: ${assignment.name}`,
        color: '#f59e0b' // Fixed Orange for all assignments to be distinct from Courses
      };
    });
    events = [...events, ...assignmentEvents];
  }

  // Custom Event Styling
  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      border: 'none',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      display: 'block',
      backgroundColor: event.color,
      fontSize: '0.75rem', // Smaller font
      padding: '1px 4px', // Compact padding
      lineHeight: '1.2'
    };

    if (event.type === 'assignment') {
      style.borderLeft = '3px solid #b45309'; // Darker orange border
      style.fontWeight = '600';
    } else {
        // Course events
        style.opacity = 0.85;
    }

    return {
      style: style
    };
  };

  return (
    <div style={{height: height}} className="p-3">
    <BigCalendar 
      defaultView='month' 
      localizer={localizer} 
      events={events} 
      startAccessor="start" 
      endAccessor="end" 
      locales={locales}
      onSelectEvent={handleEventClick}
      eventPropGetter={eventStyleGetter}
      popup
      />
      
      {selectedEvent && (
        <Modal show={true} onHide={handleCloseModal} centered contentClassName="glass-modal">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>{selectedEvent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="fs-5">{selectedEvent.desc}</p>
            <p className="text-muted">
              {selectedEvent.allDay 
                ? format(selectedEvent.start, 'PPPP') 
                : `${format(selectedEvent.start, 'PPPP p')} - ${format(selectedEvent.end, 'p')}`
              }
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default MyCalendar;