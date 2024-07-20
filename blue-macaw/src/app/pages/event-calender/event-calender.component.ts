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
  categories = [
    { name: 'Family Events', color: '#FFCDD2' },
    { name: 'Birthdays', color: '#F8BBD0' },
    { name: 'Work', color: '#E1BEE7' },
    { name: 'Trash Pickup', color: '#D1C4E9' },
    { name: 'Important Events', color: '#C5CAE9' },
    { name: 'Generic Events', color: '#BBDEFB' }
  ];

  calendarEvents: EventInput[] = [
    { id: uuidv4(), title: 'Event 1', date: '2024-07-20', color: '#FFCDD2', start: '10:00', end: '11:00', seriesId: 's1' },
    { id: uuidv4(), title: 'Event 2', date: '2024-07-22', color: '#F8BBD0', start: '12:00', seriesId: 's2' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    firstDay: 1, // Set the first day of the week to Monday
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
      eventDate: arg.event.startStr.split('T')[0],
      startTime: arg.event.startStr.split('T')[1] || '',
      endTime: arg.event.endStr ? arg.event.endStr.split('T')[1] : '',
      eventColor: arg.event.backgroundColor,
      seriesId: arg.event.extendedProps.seriesId,
      isUpdate: true
    });
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '500px', // Set the width of the dialog
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
        this.confirmDelete(result.event);
      }
    });
  }

  addEvent(event: any) {
    const seriesId = uuidv4();
    const events = this.generateRepeatingEvents({ ...event, seriesId });
    this.calendarEvents = [...this.calendarEvents, ...events];
    this.calendarOptions.events = this.calendarEvents;
  }

  updateEvent(event: any) {
    this.calendarEvents = this.calendarEvents.filter(evt => evt['seriesId'] !== event.seriesId);
    const events = this.generateRepeatingEvents(event);
    this.calendarEvents = [...this.calendarEvents, ...events];
    this.calendarOptions.events = this.calendarEvents;
  }

  deleteEvent(eventId: string) {
    this.calendarEvents = this.calendarEvents.filter(event => event.id !== eventId);
    this.calendarOptions.events = this.calendarEvents;
  }

  deleteSeries(seriesId: string) {
    this.calendarEvents = this.calendarEvents.filter(event => event['seriesId'] !== seriesId);
    this.calendarOptions.events = this.calendarEvents;
  }

  confirmDelete(event: any) {
    const confirmDialog = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: { seriesId: event.seriesId }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result && result.action === 'deleteSeries') {
        this.deleteSeries(result.seriesId);
      } else if (result && result.action === 'deleteOccurrence') {
        this.deleteEvent(event.eventId);
      }
    });
  }

  generateRepeatingEvents(event: any): EventInput[] {
    const events: EventInput[] = [];
    const startDate = moment(event.eventDate);
    const endDate = event.endDate ? moment(event.endDate) : moment(startDate).add(1, 'year');
    const increment = this.getIncrement(event.repeat);
    const maxEvents = 1000; // Limit the number of events generated
    let currentDate = startDate.clone();
    let eventCount = 0;

    while ((currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) && eventCount < maxEvents) {
      const newEvent: EventInput = {
        id: uuidv4(),
        title: event.eventTitle,
        start: `${currentDate.format('YYYY-MM-DD')}T${event.startTime}`,
        end: event.endTime ? `${currentDate.format('YYYY-MM-DD')}T${event.endTime}` : undefined,
        color: event.eventColor,
        extendedProps: {
          seriesId: event.seriesId
        }
      };
      events.push(newEvent);
      currentDate.add(increment.unit as moment.DurationInputArg2, increment.value);
      eventCount++;
    }

    return events;
  }

  getIncrement(repeat: string) {
    switch (repeat) {
      case 'day': return { unit: 'days', value: 1 };
      case 'week': return { unit: 'weeks', value: 1 };
      case 'month': return { unit: 'months', value: 1 };
      case '3months': return { unit: 'months', value: 3 };
      case '6months': return { unit: 'months', value: 6 };
      case 'year': return { unit: 'years', value: 1 };
      default: return { unit: 'days', value: 0 };
    }
  }
}
