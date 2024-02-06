
export interface EnterpriceItem {
    Name: string,
    Logo: string,
    Details: Array<EnterpriceDetailItem>,
    Index?: number,
    TotalMonth?: number
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