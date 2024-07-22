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
  calendarEvents: EventInput[] = [
    { id: uuidv4(), title: 'Event 1', date: '2024-07-20', color: '#3788d8' },
    { id: uuidv4(), title: 'Event 2', date: '2024-07-22', color: '#3788d8' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.calendarEvents,
    editable: true,
    selectable: true,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    fixedWeekCount: false,
  };

  constructor(public dialog: MatDialog) {}

  handleDateClick(arg: any) {
    this.openDialog({ eventDate: arg.dateStr });
  }

  handleEventClick(arg: any) {
    this.openDialog({
      eventId: arg.event.id,
      eventTitle: arg.event.title,
      eventDate: arg.event.startStr,
      eventColor: arg.event.backgroundColor,
      isUpdate: true
    });
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { ...data, isUpdate: data.isUpdate || false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'save') {
        if (result.event.isUpdate) {
          this.updateEvent(result.event);
        } else {
          this.addEvent(result.event);
        }
      } else if (result && result.action === 'delete') {
        this.deleteEvent(result.event.eventId);
      }
    });
  }

  addEvent(event: any) {
    const newEvent: EventInput = { id: uuidv4(), title: event.eventTitle, date: event.eventDate, color: event.eventColor };
    this.calendarEvents = [...this.calendarEvents, newEvent];
    this.calendarOptions.events = this.calendarEvents;
  }

  updateEvent(event: any) {
    this.calendarEvents = this.calendarEvents.map(evt => {
      if (evt.id === event.eventId) {
        return { ...evt, title: event.eventTitle, date: event.eventDate, color: event.eventColor };
      }
      return evt;
    });
    this.calendarOptions.events = this.calendarEvents;
  }

  deleteEvent(eventId: string) {
    this.calendarEvents = this.calendarEvents.filter(event => event.id !== eventId);
    this.calendarOptions.events = this.calendarEvents;
  }
}
