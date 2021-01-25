import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { FinanceReportService } from './services/finance-report.service';
import { TransactionService } from '../transactions/transaction.service';

import { ApiConstant } from '../../shared/api-constant.enum';

import { organization } from '../data/org';
import { finYear } from '../data/finYear';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';

@Component({
  selector: 'app-finance-report',
  templateUrl: './finance-report.component.html',
  styleUrls: ['./finance-report.component.scss']
})
export class FinanceReportComponent implements OnInit {

  public summaryData: any = {};
  public isLoading: boolean = false;
  public defaultFilterList: any = [
    {
      id: 'CMF01',
      fieldName: "finyearid",
      indexField: "finyearid",
      labelName: "Financial Year",
      dataType: "Dropdown",
      popupTo: {
        recordBatchSize: 25,
        data: finYear.data
      },
      listingColumnFieldName: "finyearid",
      data: finYear.data,
      isDataLoaded: true,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false
    }
  ];

  private filterParam: any = {
    finyearid: []
  };

  constructor(
    private broadcast: BroadcastService,
    private util: CommonUtilService,
    private financeService: FinanceReportService,
    private tranService: TransactionService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.setSummaryData();
  }

  onFilterChange(evt) {
    // console.log(evt);
    this.setSummaryData();
    this.broadcast.broadcast('FINANCE_LEDGER_EDIT', {

    })
  }

  setSummaryData() {
    this.tranService.initOrgFinYearDDValue();
    this.filterParam.finyearid = [this.tranService.selOrgFinYear.finyearid];
    this.loadSummaryData();
  }

  loadSummaryData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.httpClient.get(ApiConstant.getSummaryYear + '/' + this.filterParam.finyearid).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulateSummaryData(data.data);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading summary details year wise!'
      })
    });
  }

  manipulateSummaryData(data) {
    data.shortage = data.target_amount - data.total_amount;
    data.percentage = Math.min((data.total_amount / data.target_amount) * 100, 100) + '%';
    this.summaryData = data;
    this.financeService.setSummaryData(data);
    this.broadcast.broadcast('SET_SUMMARY_DATA', data);
  }
}
