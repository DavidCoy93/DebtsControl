import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnterpriceDetailItem, EnterpriceItem } from '../models/debts-item';

@Injectable({
  providedIn: 'root'
})
export class DebtService {

  constructor(private http: HttpClient) { }

  GetDebts(): Observable<Array<EnterpriceItem>> {
    return this.http.get<Array<EnterpriceItem>>(`${environment.UrlApi}/debts/GetDebts`)
  }
  
  CreateDebt(debt: EnterpriceItem): Observable<Array<EnterpriceItem>> {
    return this.http.post<Array<EnterpriceItem>>(`${environment.UrlApi}/debts/CreateDebt`, debt);
  }

  AddUpdateDetailDebt(Detail: EnterpriceDetailItem, IndexDebt: number, IndexDetail: number, Action: string): Observable<Array<EnterpriceDetailItem>> {
    return this.http.put<Array<EnterpriceDetailItem>>(`${environment.UrlApi}/debts/UpdateDetailDebt/${IndexDebt}/${IndexDetail}/${Action}`, Detail);
  }
}
