import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Coach {
  _id: string;
  name: string;
  email: string;
}

interface SessionEvent {
  _id: string;
  name: string;
  start: string | Date;
  end: string | Date;
  coaches: Coach[];
}

interface CalendarEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: SessionEvent;
  coaches: Coach[];
}

interface CalendarProps {
  events?: SessionEvent[];
  userRole?: 'admin' | 'coach';
}

export default function Calendar({ events = [], userRole = 'coach' }: CalendarProps) {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Transform events to calendar format
    const transformedEvents: CalendarEvent[] = events.map((event, index) => ({
      id: event._id || index.toString(),
      title: event.name,
      start: new Date(event.start),
      end: new Date(event.end),
      resource: event,
      coaches: event.coaches || []
    }));
    setCalendarEvents(transformedEvents);
  }, [events]);

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6'; // default blue
    
    if (event.coaches && event.coaches.length > 0) {
      // Color code by first coach (you can enhance this)
      const coachNames = event.coaches.map(c => c.name || c).join('');
      const hash = coachNames.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      const colors = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // yellow
        '#8b5cf6', // purple
        '#06b6d4', // cyan
        '#f97316', // orange
        '#ec4899', // pink
      ];
      
      backgroundColor = colors[Math.abs(hash) % colors.length];
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const messages = {
    allDay: 'All Day',
    previous: '<',
    next: '>',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Time',
    event: 'Event',
    noEventsInRange: 'There are no events in this range.',
  };

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-md p-4">
      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        messages={messages}
        defaultView="week"
        views={['month', 'week', 'day']}
        step={60}
        timeslots={1}
        selectable
        popup
      />
    </div>
  );
} 