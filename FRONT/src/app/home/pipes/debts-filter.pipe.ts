import { Pipe, PipeTransform } from '@angular/core';
import { EnterpriceItem } from 'src/app/models/debts-item';

@Pipe({
  name: 'debtsFilter'
})
export class DebtsFilterPipe implements PipeTransform {

  transform(value: Array<EnterpriceItem>, searchText: string): Array<EnterpriceItem> {
    return value.filter(x => x.Name.toLowerCase().includes(searchText.toLowerCase()));
  }

}
