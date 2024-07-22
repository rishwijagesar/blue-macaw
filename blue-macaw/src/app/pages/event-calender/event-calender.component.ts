import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { v4 as uuidv4 } from 'uuid';
import { EventDialogComponent } from '../events/event-dialog/event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DeleteConfirmDialogComponent } from '../events/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-event-calender',
  templateUrl: './event-calender.component.html',
  styleUrls: ['./event-calender.component.scss']
})
export class EventCalenderComponent {
  eventTitle: string = '';
  eventDate: string = '';
  selectedEventId: string | null = null;

  calendarEvents: EventInput[] = [
    { id: uuidv4(), title: 'Event 1', date: '2024-07-20' },
    { id: uuidv4(), title: 'Event 2', date: '2024-07-22' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.calendarEvents,
    editable: true,
    selectable: true,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  handleDateClick(arg: any) {
    this.eventDate = arg.dateStr;
  }

  handleEventClick(arg: any) {
    this.selectedEventId = arg.event.id;
    this.eventTitle = arg.event.title;
    this.eventDate = arg.event.startStr;
  }

  addEvent() {
    if (this.eventTitle && this.eventDate) {
      const newEvent: EventInput = { id: uuidv4(), title: this.eventTitle, date: this.eventDate };
      this.calendarEvents = [...this.calendarEvents, newEvent];
      this.calendarOptions.events = this.calendarEvents;
      this.clearForm();
    } else {
      alert('Please enter both title and date');
    }
  }

  deleteEvent() {
    if (this.selectedEventId) {
      this.calendarEvents = this.calendarEvents.filter(event => event.id !== this.selectedEventId);
      this.calendarOptions.events = this.calendarEvents;
      this.clearForm();
    } else {
      alert('Please select an event to delete');
    }
  }

  updateEvent() {
    if (this.selectedEventId && this.eventTitle && this.eventDate) {
      this.calendarEvents = this.calendarEvents.map(event => {
        if (event.id === this.selectedEventId) {
          return { ...event, title: this.eventTitle, date: this.eventDate };
        }
        return event;
      });
      this.calendarOptions.events = this.calendarEvents;
      this.clearForm();
    } else {
      alert('Please select an event and enter both title and date');
    }
  }

  clearForm() {
    this.eventTitle = '';
    this.eventDate = '';
    this.selectedEventId = null;
  }
}
