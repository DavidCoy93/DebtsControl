import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface DebtsFormItem {
    Name: FormControl<string>,
    Logo: FormControl<string>,
    Details: FormArray<FormGroup<DebtsDetailFormItem>>
}

export interface DebtsDetailFormItem {
    Description: FormControl<string>,
    RemainingPayments: FormControl<number>,
    UnitPrice: FormControl<number>,
    IsPaid: FormControl<boolean>,
    PaymentDate: FormControl<string>
    Total: FormControl<number>
}