import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinanceReportService {

  public summaryData: any = null;

  constructor() { }

  setSummaryData(data) {
    this.summaryData = data;
  }
}
