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
    title: 'Testing event',
    start: new Date(2024,2,1,8,30),
    end: new Date(2024,2,1,14,30)
  },
  {
    title: 'Testing 2',
    start: moment('2024-03-15T10:00:00').toDate(),
    end: moment('2024-03-20T15:00:00').toDate(),
  }
];

const MyCalendar = ({courses}) => {

  //add map for courses here (format??)

  return (
    <div style={{height: "600px"}}>
    <BigCalendar 
      defaultView='week' 
      localizer={localizer} 
      events={events} 
      startAccessor='start' 
      endAccessor='end' 
      locales={locales}/>
    </div>
  );
}

export default MyCalendar;
