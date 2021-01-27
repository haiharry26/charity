import { Injectable } from '@angular/core';

import { organization } from '../data/org';
import { finYear } from '../data/finYear';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  public selOrgFinYear: any = {
    orgid: null,
    selOrgData: null,
    finyearid: null,
    selFinYearData: null
  };

  private orgData: any = organization.data;
  private finYearData: any = finYear.data;

  constructor() { 

  }

  initOrgFinYearDDValue() {
    for (let item of this.orgData) {
      if (item.isSelected) {
        this.selOrgFinYear.selOrgData = item;
        this.selOrgFinYear.orgid = item.id;
      }
    }

    for (let item of this.finYearData) {
      if (item.isSelected) {
        this.selOrgFinYear.selFinYearData = item;
        this.selOrgFinYear.finyearid = item.id;
      }
    }
  }
  
}
