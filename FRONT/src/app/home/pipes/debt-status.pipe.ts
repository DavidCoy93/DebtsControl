import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'debtStatus'
})
export class DebtStatusPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
    return (value) ? 'Pagado' : 'Pendiente'
  }

}
