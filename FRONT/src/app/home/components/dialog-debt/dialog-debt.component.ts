import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DebtsDetailFormItem, DebtsFormItem } from 'src/app/models/debts-form-item';
import { EnterpriceDetailItem, EnterpriceItem } from 'src/app/models/debts-item';
import { DialogDebtDetailComponent } from '../dialog-debt-detail/dialog-debt-detail.component';

@Component({
  selector: 'app-dialog-debt',
  templateUrl: './dialog-debt.component.html',
  styleUrls: ['./dialog-debt.component.scss']
})
export class DialogDebtComponent {

  debtForm: FormGroup<DebtsFormItem> = new FormGroup<DebtsFormItem>(
    {
      Name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
      Logo: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
      Details: new FormArray<FormGroup<DebtsDetailFormItem>>([])
    }
  )

  constructor(
    private dialogRef: MatDialogRef<DialogDebtComponent, EnterpriceItem | null>,
    @Inject(MAT_DIALOG_DATA) public data: EnterpriceItem | null,
    private dialog: MatDialog
  ) {

  }

  get controls() { return this.debtForm.controls }

  closeDialog(action: string): void {
    if (action === 'save') {
      const debtObj: EnterpriceItem = this.debtForm.getRawValue();
      this.dialogRef.close(debtObj);
    } else {
      this.dialogRef.close(null);
    }
  }

  selectLogo(inputFile: HTMLInputElement): void {
    if (inputFile.files !== null ) {
      if (inputFile.files.length > 0) {
        let file = inputFile.files[0];
        const fr = new FileReader()
        fr.readAsDataURL(file);
        fr.onloadend = (ev) => {
          if (fr.error === null) {
            if (typeof fr.result === 'string') {
              this.controls.Logo.setValue(fr.result);
              this.debtForm.updateValueAndValidity({onlySelf: false});
            }
          }
        }
      }
    }
  }

  openDetailDialog(): void {
    this.dialog.open<DialogDebtDetailComponent, EnterpriceDetailItem | null, FormGroup<DebtsDetailFormItem> | null>(DialogDebtDetailComponent,
      {
        data: null,
        height: '50%',
        width: '50%',
        disableClose: true
      }
    ).afterClosed().subscribe(result => {
      if (typeof result === 'object') {
        if (result !== null) {
          this.controls.Details.push(result);
        }
      }
    })
  }
}
