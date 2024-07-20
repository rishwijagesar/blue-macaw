import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent {
  categories = [
    { name: 'Family Events', color: '#FFCDD2' },
    { name: 'Birthdays', color: '#F8BBD0' },
    { name: 'Work', color: '#E1BEE7' },
    { name: 'Trash Pickup', color: '#D1C4E9' },
    { name: 'Important Events', color: '#C5CAE9' },
    { name: 'Generic Events', color: '#BBDEFB' }
  ];

  repeatOptions = [
    { name: 'None', value: 'none' },
    { name: 'Every Day', value: 'day' },
    { name: 'Every Week', value: 'week' },
    { name: 'Every Month', value: 'month' },
    { name: 'Every 3 Months', value: '3months' },
    { name: 'Every 6 Months', value: '6months' },
    { name: 'Every Year', value: 'year' }
  ];

  maxEndDate = moment().add(100, 'years').format('YYYY-MM-DD');

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize category based on the color if it's an update
    if (data.isUpdate) {
      this.data.category = this.categories.find(category => category.color === data.eventColor) || null;
    }
  }

  onSave(): void {
    if (this.data.repeat !== 'none' && !this.data.endDate) {
      alert('Please select an end date for repeating events.');
      return;
    }
    this.dialogRef.close({ event: this.data, action: 'save' });
  }

  onDelete(): void {
    this.dialogRef.close({ event: this.data, action: 'delete' });
  }

  onCategoryChange(category: any): void {
    this.data.eventColor = category.color;
  }
}
