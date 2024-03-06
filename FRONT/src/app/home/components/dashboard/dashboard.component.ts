import { Component, Injector, OnInit, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnterpriceDetailItem, EnterpriceItem } from 'src/app/models/debts-item';
import { DebtService } from 'src/app/services/debt.service';
import { HomeComponent } from '../../home.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogDebtComponent } from '../dialog-debt/dialog-debt.component';
import { DialogDebtDetailComponent } from '../dialog-debt-detail/dialog-debt-detail.component';
import { CommonService } from 'src/app/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';
import { DialogBoxItem } from 'src/app/models/dialog-box-item';
import { PageEvent } from '@angular/material/paginator';

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
  searchText: WritableSignal<string> = signal("");
  pageSizeOptions: Array<number> = [3,6,9,12,15,18,21,24,27,30];
  isPaid: boolean = false;
  showOnlyPendingCredits: WritableSignal<boolean> = signal(false);

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
          const nextMonth: Date = new Date(this.Today.getFullYear(), this.Today.getMonth() + 1, 1, 0, 0, 0, 0)
          val.forEach((de, i, ei) => {
            de.Index = i;
            de.TotalMonth = 0;
            de.TotalNextMonth = 0;
            de.Paginator = {
              start: 0,
              end: 2,
              pageIndex: 0,
              itemsPage: 3
            }
            if (typeof de.showOnlyPendingCredits === 'undefined') {
              de.showOnlyPendingCredits = signal(false);
            }

            de.Details.forEach((det, ind, detArr) => {
              det.ShowDetails = false;
              det.indexDet = ind;

              if (typeof det.PaymentDate === 'string' && typeof de.TotalMonth === 'number' && typeof de.TotalNextMonth === 'number') {
                const registeredPayDate: Date = new Date(det.PaymentDate);


                if (this.Today.getTime() > registeredPayDate.getTime()) {
                  const nextPayDate: Date = this.calculateNextExactPaymentDate(registeredPayDate);
                  det.PaymentDate = nextPayDate.toJSON();

                  const isLessThanCurrentDate: boolean = (this.Today.getTime()  > nextPayDate.getTime());
                  const differenceMonth: number = nextPayDate.getMonth() - registeredPayDate.getMonth();

                  let currentRemainingPayments = det.RemainingPayments - (differenceMonth);

                  currentRemainingPayments = (isLessThanCurrentDate) ? (currentRemainingPayments - 1) : currentRemainingPayments;

                  const isLessOrEqualToZero: boolean = (currentRemainingPayments <= 0);

                  det.RemainingPayments = (isLessOrEqualToZero) ? 0 : currentRemainingPayments;
                  det.Total = (det.UnitPrice * det.RemainingPayments);

                  if (det.RemainingPayments > 0 ) {

                    if (nextPayDate.getTime() > this.Today.getTime()) {
                      de.TotalNextMonth += det.UnitPrice;
                      de.TotalMonth += det.UnitPrice;
                    } else {
                      de.TotalNextMonth += det.UnitPrice;
                    }
                  } 

                } else if (registeredPayDate.getTime() > nextMonth.getTime()) {
                  de.TotalNextMonth += det.UnitPrice;
                } else {
                  de.TotalMonth += det.UnitPrice;
                }

                det.IsPaid = det.RemainingPayments === 0;
                this.TotalDebts += det.Total;
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
    const differenceMonths = (this.Today.getMonth() - paymentDate.getMonth());
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

                  let debtList = this.$BsDebtList.getValue();

                  debtList[IndexDebt].Details = resp;

                  this.$BsDebtList.next(debtList);
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

  payMonthDetail(indDebt: number, indDetail: number): void {
    this.dialog.open<DialogBoxComponent, DialogBoxItem, boolean>(DialogBoxComponent, 
      {
        data: { Title: "Esta a punto de cagarla", Message: "¿Esta seguro que ya pago la mensualidad?", Type: 'confirm' },
        width: '300px',
        height: '200px',
        hasBackdrop: true,
        disableClose: true
      }
    ).afterClosed().subscribe(result => {
      if (typeof result === 'boolean' && result) {
        let debtList = this.$BsDebtList.getValue();
        let detail = debtList[indDebt].Details[indDetail];
        detail.Total = detail.Total - detail.UnitPrice;
        detail.RemainingPayments = Number((detail.Total / detail.UnitPrice).toFixed(0));
        debtList[indDebt].Details[indDetail] = detail;

        this.$BsDebtList.next(debtList);
      }
    })
  }

  onDragDetail(evt: DragEvent, indDebt?: number, indDet?: number): void {
    console.log("agarra puras mamadas");
  }
  
  changePage(pageEvt: PageEvent, debt: EnterpriceItem): void {

    const startPage: number = (pageEvt.pageSize * pageEvt.pageIndex);
    const endloop: number =  (startPage + pageEvt.pageSize) - 1;

    if (typeof debt.Paginator === 'object') {
      debt.Paginator.pageIndex = pageEvt.pageIndex;
      debt.Paginator.itemsPage = pageEvt.pageSize;
      debt.Paginator.start = startPage;
      debt.Paginator.end = (endloop >= debt.Details.length) ? debt.Details.length - 1 : endloop;
    }
  }

  filterDetails(value: boolean, indeXDebt?: number): void {
    if (typeof indeXDebt === 'number') {
      let debtList: Array<EnterpriceItem> = this.$BsDebtList.getValue();
      let debt: EnterpriceItem = debtList[indeXDebt];
      if (value) {
        const allDetails: Array<EnterpriceDetailItem> = debt.Details;
        const allDetailsStr: string = JSON.stringify(allDetails);
        
        sessionStorage.setItem(`detailsInd${indeXDebt}`, allDetailsStr);
  
        const filteredDetails: Array<EnterpriceDetailItem> = allDetails.filter(x => x.IsPaid === false);
        debt.Details = filteredDetails;
      } else {
        const allDetailsStr = sessionStorage.getItem(`detailsInd${indeXDebt}`) || '';
        const allDetails = JSON.parse(allDetailsStr) as Array<EnterpriceDetailItem>;
        debt.Details = allDetails;
      }
      this.$BsDebtList.next(debtList);
    }
  }

}
