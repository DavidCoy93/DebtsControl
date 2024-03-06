import { Pipe, PipeTransform } from '@angular/core';
import { EnterpriceDetailItem } from 'src/app/models/debts-item';

@Pipe({
  name: 'debtDetails'
})
export class DebtDetailsPipe implements PipeTransform {

  transform(value: EnterpriceDetailItem[], start: number, end: number): EnterpriceDetailItem[] {
    let paginatedItems: EnterpriceDetailItem[] = [];

    for (let i = start; i <= end; i++) {
      const item = value[i];
      paginatedItems.push(item);
    }

    return paginatedItems;
  }

}
