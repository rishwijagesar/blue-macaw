import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { v4 as uuidv4 } from 'uuid';
import { EventDialogComponent } from '../events/event-dialog/event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-event-calender',
  templateUrl: './event-calender.component.html',
  styleUrls: ['./event-calender.component.scss']
})
export class EventCalenderComponent {
  categories = [
    { name: 'All Events', color: 'blue', isDefault: true },
    { name: 'Family Events', color: '#FFCDD2' },
    { name: 'Birthdays', color: '#F8BBD0' },
    { name: 'Work', color: '#E1BEE7' },
    { name: 'Trash Pickup', color: '#D1C4E9' },
    { name: 'Important Events', color: '#C5CAE9' },
    { name: 'Generic Events', color: '#BBDEFB' }
  ];
  
  selectedCategory = 'All Events';

  calendarEvents: EventInput[] = [
    { id: uuidv4(), title: 'Event 1', start: '2024-07-20T10:00:00', end: '2024-07-20T12:00:00', color: '#FFCDD2', category: 'Family Events' },
    { id: uuidv4(), title: 'Event 2', start: '2024-07-22T14:00:00', color: '#F8BBD0', category: 'Birthdays' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    fixedWeekCount: false,
    firstDay: 1, // Set the first day of the week to Monday
    dayCellClassNames: (arg) => this.getDayClass(arg),
    events: this.calendarEvents,
  };

  constructor(public dialog: MatDialog) {}

  handleDateClick(arg: any) {
    this.openDialog({ eventDate: arg.dateStr });
  }

  handleEventClick(arg: any) {
    this.openDialog({
      eventId: arg.event.id,
      eventTitle: arg.event.title,
      eventStart: arg.event.startStr,
      eventEnd: arg.event.endStr,
      eventColor: arg.event.backgroundColor,
      category: arg.event.extendedProps.category,
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
    const newEvent: EventInput = { id: uuidv4(), title: event.eventTitle, start: this.combineDateTime(event.eventDate, event.eventStart), end: this.combineDateTime(event.eventDate, event.eventEnd), color: event.eventColor, category: event.category };
    this.calendarEvents = [...this.calendarEvents, newEvent];
    this.filterEvents();
  }

  updateEvent(event: any) {
    this.calendarEvents = this.calendarEvents.map(evt => {
      if (evt.id === event.eventId) {
        return { ...evt, title: event.eventTitle, start: this.combineDateTime(event.eventDate, event.eventStart), end: this.combineDateTime(event.eventDate, event.eventEnd), color: event.eventColor, category: event.category };
      }
      return evt;
    });
    this.filterEvents();
  }

  deleteEvent(eventId: string) {
    this.calendarEvents = this.calendarEvents.filter(event => event.id !== eventId);
    this.filterEvents();
  }

  combineDateTime(date: string, time: string): string {
    if (!time) {
      return date;
    }
    return moment(date).format('YYYY-MM-DD') + 'T' + moment(time, 'HH:mm').format('HH:mm:ss');
  }

  filterEvents() {
    if (this.selectedCategory === 'All Events') {
      this.calendarOptions.events = [...this.calendarEvents];
    } else {
      this.calendarOptions.events = this.calendarEvents.filter(event => event['category'] === this.selectedCategory);
    }
  }

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    this.filterEvents();
  }

  showAllEvents() {
    this.selectedCategory = 'All Events';
    this.filterEvents();
  }

  getDayClass(arg: any): string {
    const day = moment(arg.date).day();
    return (day === 6 || day === 0) ? 'fc-weekend' : '';
  }
}
