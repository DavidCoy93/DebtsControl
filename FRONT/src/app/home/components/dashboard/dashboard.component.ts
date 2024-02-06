import { Component, Injector, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnterpriceDetailItem, EnterpriceItem } from 'src/app/models/debts-item';
import { DebtService } from 'src/app/services/debt.service';
import { HomeComponent } from '../../home.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogDebtComponent } from '../dialog-debt/dialog-debt.component';
import { DialogDebtDetailComponent } from '../dialog-debt-detail/dialog-debt-detail.component';
import { CommonService } from 'src/app/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  $debtsOperations: Observable<Array<EnterpriceItem>> = new Observable<Array<EnterpriceItem>>(subs => {
    subs.next()
  })
  $BsDebtList: BehaviorSubject<Array<EnterpriceItem>> = new BehaviorSubject<Array<EnterpriceItem>>([]);
  TotalDebts: number = 0;
  homeComponent: HomeComponent;
  IsSmallScreen: boolean = false;
  Today: Date = new Date();
  searchText: string = "";

  constructor(
      private _debtsService: DebtService,
      private _injector: Injector,
      private dialog: MatDialog,
      private _commonService: CommonService
  ) {
    this.homeComponent = this._injector.get<HomeComponent>(HomeComponent);
    this.homeComponent.$IsSmallScreen.subscribe(val => {
      this.IsSmallScreen = val;
    });
    this.crudDebt();
  }

  ngOnInit(): void {

    this.$BsDebtList.subscribe(
      {
        next: (val) => {
          this.TotalDebts = 0;
          val.forEach((de, i, ei) => {
            de.Index = i;
            de.TotalMonth = 0
            de.Details.forEach((det, ind, detArr) => {
              det.ShowDetails = false;
              det.indexDet = ind;
              if (typeof de.TotalMonth === 'number') {
                de.TotalMonth += (det.RemainingPayments > 0) ? det.UnitPrice : 0;
              }
              this.TotalDebts += (det.RemainingPayments * det.UnitPrice);
              if (typeof det.PaymentDate === 'string') {
                const payDate: Date = new Date(det.PaymentDate);
                if (this.Today.getTime() > payDate.getTime() && det.RemainingPayments > 0) {
                  const nextPayDate: Date = this.calculateNextExactPaymentDate(payDate);
                  det.PaymentDate = nextPayDate.toJSON();
                }
              }
            })
          })
        },
        error: (err: any) => {
          alert(err)
        }
      }
    )

    setInterval(() => {
      this.crudDebt();
    }, 9e5)
  }

  crudDebt(debt?: EnterpriceItem): void {
    this.$debtsOperations = (typeof debt === 'undefined') ? this._debtsService.GetDebts() : this._debtsService.CreateDebt(debt);
    this.$debtsOperations.subscribe(
      {
        next: (val) => {
          this.$BsDebtList.next(val);
        },
        error: (err) => {
          if (this.$BsDebtList.getValue().length > 0) {
            this.$BsDebtList.error(err);
          }
          
        }
      }
    )
  }

  AddEditDebt(): void {
    this.dialog.open<DialogDebtComponent, EnterpriceItem | null, EnterpriceItem | null>(DialogDebtComponent, 
      {
        data: null,
        height: (this.IsSmallScreen) ? '95%' :'80%',
        width: (this.IsSmallScreen) ? '95%' : '50%',
        disableClose: true
      }
    ).afterClosed().subscribe(result => {
      if (typeof result === 'object') {
        if (result !== null) {
          this.crudDebt(result);
        }
      }
    })
  }


  calculateNextExactPaymentDate(paymentDate: Date): Date {
    const differenceMonths: number = (this.Today.getMonth() - paymentDate.getMonth()) === 0 ? 1 : (this.Today.getMonth() - paymentDate.getMonth()) ;
    const differenceYears: number = (this.Today.getFullYear() - paymentDate.getFullYear());
    const possiblePaymentDate = new Date((paymentDate.getFullYear() + differenceYears), (paymentDate.getMonth() + differenceMonths), paymentDate.getDate(),23,59,59,999);
    const isALeapYear: boolean = (possiblePaymentDate.getFullYear() % 4) === 0;

    if (this.Today.getMonth() === 1 && isALeapYear && paymentDate.getDate() >= 29 ) {
      return new Date(possiblePaymentDate.getFullYear(), this.Today.getMonth(), 29, 23, 59,59,999);
    } 
    else if (this.Today.getMonth() === 1 && !isALeapYear && paymentDate.getDate() >= 28) {
      return new Date(possiblePaymentDate.getFullYear(), this.Today.getMonth(), 28, 23, 59,59,999);
    } else {
      return possiblePaymentDate;
    }
  }

  addUpdateDetailDebt(IndexDebt: number, Action: string, IndexDetail?: number, Detail?: EnterpriceDetailItem): void {
    this._commonService.isFromDashboard = true;
    this.dialog.open<DialogDebtDetailComponent, EnterpriceDetailItem | null, EnterpriceDetailItem | null>(DialogDebtDetailComponent, 
      {
        data: (typeof Detail === 'undefined') ? null : Detail,
        height: '50%',
        width: '50%'
      }
    ).afterClosed().subscribe((result) => {
      if (typeof result === 'object') {
        if (result !== null) {
          if (typeof IndexDetail === 'number') {
            this._debtsService.AddUpdateDetailDebt(result, IndexDebt, IndexDetail, Action).subscribe(
              {
                next: (resp) => {
                  if (resp) {
                    let debtList = this.$BsDebtList.getValue();

                    if (Action === 'update') {
                      debtList[IndexDebt].Details[IndexDetail] = result;
                    } else{
                      debtList[IndexDebt].Details.push(result);
                    }

                    this.$BsDebtList.next(debtList);
                  }
                },
                error: (err: HttpErrorResponse) => {
                  alert(err.message);
                }
              }
            )
          }
        }
      }
    })
  }
}
