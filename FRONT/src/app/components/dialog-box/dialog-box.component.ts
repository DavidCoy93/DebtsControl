import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogBoxItem } from 'src/app/models/dialog-box-item';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  
  constructor(
    private dialogRef: MatDialogRef<DialogBoxComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: DialogBoxItem
  ) {}


  close(result: boolean) {
    this.dialogRef.close(result);
  }

}
