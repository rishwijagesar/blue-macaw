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

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave(): void {
    this.dialogRef.close({ event: this.data, action: 'save' });
  }

  onDelete(): void {
    this.dialogRef.close({ event: this.data, action: 'delete' });
  }

  onCategoryChange(category: any): void {
    this.data.eventColor = category.color;
  }
}
