import { WritableSignal } from "@angular/core"

export interface EnterpriceItem {
    Name: string,
    Logo: string,
    Details: Array<EnterpriceDetailItem>,
    Index?: number,
    TotalMonth?: number,
    TotalNextMonth?: number,
    Paginator?: PaginatorItem,
    showOnlyPendingCredits?: WritableSignal<boolean>
}

export interface EnterpriceDetailItem {
    Description: string,
    RemainingPayments: number,
    UnitPrice: number,
    IsPaid: boolean,
    PaymentDate: string,
    Total: number,
    ShowDetails?: boolean,
    indexDet?: number,
}

export interface PaginatorItem {
    start: number,
    end: number,
    pageIndex: number,
    itemsPage: number
}