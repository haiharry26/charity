import { Component, OnInit, Input, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { BroadcastService } from '../../../shared/broadcast.service';
import { CommonUtilService } from '../../../shared/common-util.service';
import { TransactionService } from '../../transactions/transaction.service';
import { FinanceReportService } from '../services/finance-report.service';

import { ApiConstant } from '../../../shared/api-constant.enum';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit, OnDestroy {

  @Input() isForEdit = false;
  @Input() selectedRow: any = null;

  @ViewChild('element', { static: true }) $element: any;

  @Output() onAddSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output() onUpdateSuccess: EventEmitter<any> = new EventEmitter<any>();

  public isValid = true;
  public isSubmiting = false;
  public isLoading = false;
  public isLoadingError = false;

  public inputElem: any = {
    seqno1: null,
    seqno2: null,
    seqno3: null,
    seqno4: null,
    seqno5: null,
    seqno6: null,
    seqno7: null,
    seqno8: null,
    seqno9: null,
    seqno10: null,
    seqno11: null,
    seqno12: null,
    seqno13: null,
    seqno14: null,
    seqno15: null,
    seqno16: null,
    seqno17: null,
    seqno18: null,
    seqno19: null
  };

  @Input() summaryData: any = {};
  @Input() finYearLedgerData: any = null;


  private filterParam: any = {
    finyearid: []
  };
  private editSub: Subscription;
  private editSub1: Subscription;
  private paramObj: any = {};

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private financeService: FinanceReportService,
    private tranService: TransactionService,
    private httpClient: HttpClient
  ) { }

  listen() {
    this.editSub = this.broadcast.on<string>('FINANCE_LEDGER_EDIT').subscribe((data: any) => {
      this.setFinancialYearData();
      this.loadData(data);
    });

    this.editSub1 = this.broadcast.on<string>('SET_SUMMARY_DATA').subscribe((data: any) => {
      this.setSummaryData(data);
    });
  }

  ngOnInit(): void {
    this.init();
    this.listen();
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
    this.editSub1.unsubscribe();
  }

  init() {
    this.setFinancialYearData();
    this.loadData();
  }

  setSummaryData(data) {
    this.summaryData = data;
    this.inputElem.seqno18 = this.summaryData.total_amount;
    this.inputElem.seqno19 = this.summaryData.shortage;
  }

  setFinancialYearData() {
    this.tranService.initOrgFinYearDDValue();
    this.filterParam.finyearid = [this.tranService.selOrgFinYear.finyearid];
    // this.summaryData = this.tranService.selOrgFinYear.selFinYearData;
  }

  loadData(opt?: any) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    let paramObj = {
      "finyearid": this.filterParam.finyearid ? this.filterParam.finyearid : []
    }
    this.httpClient.post(ApiConstant.findMultipleLedgerFilter, paramObj).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulateData(data);
      this.setSeqWiseObj();
      console.log(data);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Financial Year Ledger Details!'
      })
    });
  }

  manipulateData(data) {
    const respData = data.data;
    for (let item of respData) {
      if ([1, 2, 4, 5, 14, 15, 16].indexOf(item.seqno) > -1) {
        item.isReadonly = false;
        item.isDisable = false;
      } else {
        item.isReadonly = true;
        item.isDisable = true;
      }
    }
    this.finYearLedgerData = respData;
  }

  setSeqWiseObj() {
    for (let item of this.finYearLedgerData) {
      for (let key in this.inputElem) {
        if (key === 'seqno' + item.seqno) {
          this.inputElem[key] = item;
        }
      }
    }
    console.log(this.inputElem);
  }

  onFocus(evt, key, item) {
    evt.target.select();
  }

  onChange(evt, key, item) {
    if (key === 1 || key === 2) {
      this.calSumSeq3();
    } else if (key === 4 || key === 5) {
      this.calSumSeq6();
    } else if (key === 14 || key === 15) {
      this.inputElem['seqno' + key].amount = -Math.abs(this.inputElem['seqno' + key].amount);
      this.calSubSeq17();
    } else if (key === 16) {
      this.calSubSeq17();
    }
  }

  calSumSeq3() {
    this.inputElem.seqno3.amount = this.inputElem.seqno1.amount + this.inputElem.seqno2.amount;
    this.calSumSeq7();
  }

  calSumSeq6() {
    this.inputElem.seqno6.amount = this.inputElem.seqno4.amount + this.inputElem.seqno5.amount;
    this.calSumSeq7();
  }

  calSumSeq7() {
    this.inputElem.seqno7.amount = this.inputElem.seqno3.amount + this.inputElem.seqno6.amount;

    // calculate seqno8
    if (this.inputElem.seqno2.amount > 0 && this.inputElem.seqno7.amount > 0) {
      this.inputElem.seqno8.amount = parseFloat((this.inputElem.seqno7.amount / 11).toFixed(2));
    } else {
      // this.inputElem.seqno8 = (this.inputElem.seqno7 / 10).toFixed(2);
    }

    // calculate seqno9
    if (this.inputElem.seqno8.amount > 0) {
      this.inputElem.seqno9.amount = -parseFloat((this.inputElem.seqno8.amount * 0.015).toFixed(2));
    }

    this.inputElem.seqno10.amount = parseFloat((this.inputElem.seqno8.amount + this.inputElem.seqno9.amount).toFixed(2));
    this.inputElem.seqno11.amount = parseFloat((this.inputElem.seqno10.amount * 0.05).toFixed(2));

    this.inputElem.seqno12.amount = -parseFloat((this.inputElem.seqno11.amount * 0.0139).toFixed(2));

    this.calSubSeq17();
  }

  calSubSeq17() {
    this.inputElem.seqno17.amount =
      (this.inputElem.seqno11.amount + this.inputElem.seqno13.amount + this.inputElem.seqno16.amount) +
      (this.inputElem.seqno12.amount + this.inputElem.seqno14.amount + this.inputElem.seqno15.amount);
  }

  formatInputValue(evt, key, item) {

  }

  cancel(evt?: any) {

  }

  validate() {

  }

  setParams() {

  }

  submitData() {
    if (this.isSubmiting) {
      return;
    }

    this.isSubmiting = true;

    this.httpClient.post(ApiConstant.saveLedgerDetails, this.finYearLedgerData).subscribe((data) => {
      this.isSubmiting = false;
      this.util.notification.success({
        title: 'Success',
        msg: 'Financial Year Ledger Details Saved Successfully.'
      });
    }, (err) => {
      this.isSubmiting = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving financial year ledger details!'
      });
    });
  }

  submit(evt?: any) {
    this.validate();
    if(this.isValid) {
      this.setParams();
      this.submitData();
    }
  }
}
