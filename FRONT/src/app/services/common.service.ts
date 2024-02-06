import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isFromDashboard: boolean = false;
  constructor() { }
}
