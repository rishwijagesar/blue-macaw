import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onDeleteSeries(): void {
    this.dialogRef.close({ action: 'deleteSeries', seriesId: this.data.seriesId });
  }

  onDeleteOccurrence(): void {
    this.dialogRef.close({ action: 'deleteOccurrence' });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
}
