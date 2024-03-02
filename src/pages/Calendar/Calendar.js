//Calendar.js
import React from 'react';
import { 
  Calendar as BigCalendar,
  dateFnsLocalizer,
  CalendarProps,
  momentLocalizer 
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import DatePicker from 'react-datepicker';
import moment from 'moment';

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

const events = [
  {
    title: 'My event',
    start: new Date(2024,2,1),
    end: new Date(2024,2,5)
  },
  {
    title: 'My event2',
    start: new Date(2024,2,10),
    end: new Date(2024,2,15)
  }
];
export default function Calendar(props) {
  return <BigCalendar defaultView='month' {...props} localizer={localizer} events={events} startAccessor='start' endAccessor='end' locales={locales}/>};
