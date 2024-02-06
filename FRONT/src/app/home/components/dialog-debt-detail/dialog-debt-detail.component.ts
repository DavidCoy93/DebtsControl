import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DebtsDetailFormItem } from 'src/app/models/debts-form-item';
import { EnterpriceDetailItem } from 'src/app/models/debts-item';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-debt-detail',
  templateUrl: './dialog-debt-detail.component.html',
  styleUrls: ['./dialog-debt-detail.component.scss']
})
export class DialogDebtDetailComponent implements OnInit {


  debtDetailForm: FormGroup<DebtsDetailFormItem> = new FormGroup<DebtsDetailFormItem>(
    {
      Description: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
      RemainingPayments: new FormControl<number>({value: 0, disabled: true}, {nonNullable: true}),
      UnitPrice: new FormControl<number>(0, {nonNullable: true, validators: [this.numberIsGreaterThanZero, Validators.required]}),
      IsPaid: new FormControl<boolean>({value: false, disabled: true}, {nonNullable: true}),
      PaymentDate: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
      Total: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, this.numberIsGreaterThanZero]})
    }
  )

  constructor(
    private dialogRef: MatDialogRef<DialogDebtDetailComponent, FormGroup<DebtsDetailFormItem> | EnterpriceDetailItem | null>,
    @Inject(MAT_DIALOG_DATA) public data: EnterpriceDetailItem | null,
    private _commonService: CommonService
  ){
    if (data !== null) 
    {
      this.debtDetailForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.Controls.Total.valueChanges.subscribe(t => {
      this.calculeRemainingPayments();
    })
    this.Controls.UnitPrice.valueChanges.subscribe(u => {
      this.calculeRemainingPayments();
    });
  }

  calculeRemainingPayments(): void {
    if (this.Controls.Total.value > 0 && this.Controls.UnitPrice.value > 0) {
      const RemainingPayments: number = Number((this.Controls.Total.value / this.Controls.UnitPrice.value).toFixed(0))
      this.Controls.RemainingPayments.setValue(RemainingPayments, {onlySelf: true});
      this.debtDetailForm.updateValueAndValidity({onlySelf: false});
    }
  }

  get Controls() { return this.debtDetailForm.controls; }

  close(action: string): void {
    if (action === 'save') {
      if (this.debtDetailForm.valid) {
        if (typeof this.Controls.PaymentDate.value === 'string') {
          const selectedDateStr: Array<string> = this.Controls.PaymentDate.value.split('/');
          const selectedDate: Date = new Date(Number(selectedDateStr[2]), Number(selectedDateStr[1]), Number(selectedDateStr[0]), 23, 59, 59, 999)
        }

        if (this._commonService.isFromDashboard) {
          const resultDash: EnterpriceDetailItem = this.debtDetailForm.getRawValue()
          this.dialogRef.close(resultDash)
        } else {
          this.dialogRef.close(this.debtDetailForm);
        }
        
      } else {
        this.debtDetailForm.markAllAsTouched();
      }
    } else {
      this.dialogRef.close(null);
    }
  }

  numberIsGreaterThanZero(control: AbstractControl<number, number>): ValidationErrors | null {
    const isValid = (control.value <= 0) ? { "IsZero": true } : null;
    return isValid;
  }

  datePickerClose(paymentDayInp: HTMLInputElement): void {
    if (paymentDayInp.value !== '') {
      const splittedDate = paymentDayInp.value.split('/');
      const d = (Number(splittedDate[0]) < 10) ? `0${splittedDate[0]}` : splittedDate[0];
      const m = (Number(splittedDate[1]) < 10) ? `0${splittedDate[1]}` : splittedDate[1];
      const y = splittedDate[2];
      
      paymentDayInp.value = `${d}/${m}/${y}`;
    }
  }

}
