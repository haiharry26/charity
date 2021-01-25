import { Component, OnInit, Input, OnDestroy, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';
import { TransactionService } from '../transaction.service';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import { organization } from '../../data/org';
import { finYear } from '../../data/finYear';
import { charity } from '../../data/charityData';
import { paymentMode } from '../../data/modeOfPay';

import * as moment from 'moment';
import 'moment-duration-format';


@Component({
  selector: 'app-add-transactions',
  templateUrl: './add-transactions.component.html',
  styleUrls: ['./add-transactions.component.scss']
})
export class AddTransactionsComponent implements OnInit, OnDestroy {

  @Input() isForEdit = false;
  @Input() selectedRow: any = null;

  @ViewChild('element', { static: true }) $element: any;

  @Output() onAddSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output() onUpdateSuccess: EventEmitter<any> = new EventEmitter<any>();

  public isValid = false;
  public isSubmiting = false;
  public isLoading = false;
  public isLoadingError = false;

  public charityData: any = null;
  public orgData: any = organization.data;
  public finYearData: any = finYear.data;
  public paymentModeData: any = paymentMode.data;

  public historyData: any = [];

  public inputElem: any = {
    selCharityData: null,
    charityid: null,
    ein: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    contactname: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    address1: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    selOrgData: null,
    orgid: null,
    selFinYearData: null,
    finyearid: null,
    suggested_amount: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    amount: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    amount_in_words: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    selPaymentMode: null,
    modeofpay: null,
    paidvia_cc: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    paid_from: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    irs_ok: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    receipt: null,
    receipt_quicken: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    direction_of: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    wording_direction: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    courties_copies: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    date_of_tran: moment(),
    transmite_date: moment(),
    check_date: moment(),
    createdate: moment(),
    email_sent: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    remarks: null,
    createdby: null
  };

  private ddFieldSourceData: any = ['charityData', 'orgData', 'finYearData', 'paymentModeData'];
  private ddFields: any = ['selCharityData', 'selOrgData', 'selFinYearData', 'selPaymentMode'];
  private ddFieldValue: any = ['charityid', 'orgid', 'finyearid', 'modeofpay'];
  private impFieldList: any = ['charityid', 'orgid', 'finyearid', 'suggested_amount', 'amount', 'modeofpay', 'paidvia_cc'];
  private noObjList: any = ['date_of_tran', 'transmite_date', 'check_date', 'remarks', 'createdate', 'createdby', 'charityid', 'orgid', 'finyearid', 'modeofpay', 'selCharityData', 'selOrgData', 'selFinYearData', 'selPaymentMode', 'receipt'];
  private isPanelOpen = false;
  private paramObj: any = {};
  private $: any = window['jQuery'];
  private ddName = '';
  private srno: any = 0;
  private editSub: Subscription;
  private editSub1: Subscription;

  constructor(
    private broadcast: BroadcastService,
    private util: CommonUtilService,
    private httpClient: HttpClient,
    private tranService: TransactionService
  ) { }

  listen() {
    this.editSub = this.broadcast.on<string>(AppConstant.CHARITY_TRANSACTIONS.LOAD_DATA_FOR_EDIT).subscribe((data: any) => {
      if (this.isPanelOpen && this.isForEdit) {
        this.loadData(data);
      }
    });

    this.editSub1 = this.broadcast.on<string>(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CHANGED).subscribe((data: any) => {
      this.isPanelOpen = data.visible;
      if (data && (data.visible || data.isOpen)) {
        if (this.isForEdit) {
          this.ddName = 'editCharityTransactionsDetails';
          this.loadData(this.selectedRow);
        } else {
          this.ddName = 'addCharityTransactionsDetails';
          this.initOrgFinYearDD();
          this.loadHistoryData();
        }
      }
    });
  }

  ngOnInit(): void {
    moment.locale('engb');
    this.init();
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
    this.editSub1.unsubscribe();
  }

  init() {
    this.initOrgFinYearDD();
    this.listen();
    this.loadCharityData();
  }

  initOrgFinYearDD() {
    this.inputElem.selOrgData = this.tranService.selOrgFinYear.selOrgData;
    this.inputElem.orgid = this.tranService.selOrgFinYear.orgid;

    this.inputElem.selFinYearData = this.tranService.selOrgFinYear.selFinYearData;
    this.inputElem.finyearid = this.tranService.selOrgFinYear.finyearid;
  }

  loadData(selectedRow) {

    if (this.isLoading || !selectedRow || !Object.keys(selectedRow).length) {
      return;
    } else if (!this.isPanelOpen || !this.isForEdit) {
      return;
    }
    this.loadCharityData();
    this.isLoading = true;
    this.srno = selectedRow.length && selectedRow[0].srno;
    this.httpClient.get(ApiConstant.getCharityTransactionsDataByIdURL + `/${this.srno}`).subscribe((data: any) => {
      this.isLoading = false;
      this.setData(data);
      this.validate();
    }, (err) => {
      this.isLoading = false;
      this.isLoadingError = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading charity transactions details by its id for edit purpose!'
      });
    });
  }


  loadCharityData() {
    if (this.util.getIsCharityAPICalled()) {
      this.charityData = this.util.getCharityDDData();
      return;
    }
    this.util.setCharityAPIDataCalled(true);
    this.httpClient.get(ApiConstant.getCharityNameForFilterURL).subscribe((data: any) => {
      this.charityData = data.data;
    }, (err: any) => {
    })
  }

  setData(data) {
    if (data && data.data) {
      const resData = data.data;
      this.paramObj.charityid = resData.charityid;
      for (const key in this.inputElem) {
        if (resData[key]) {
          if (this.noObjList.indexOf(key) > -1) {
            this.inputElem[key] = resData[key];
          } else {
            this.inputElem[key].value = resData[key];
          }
        }
      }
    }
    this.setDropdownData();
    this.loadCharityDataById();
    this.loadHistoryData();
    this.validate();
  }

  setDropdownData() {
    for (let i = 0; i < this.ddFields.length; i++) {
      this.inputElem[this.ddFields[i]] = this.returnDDData(this[this.ddFieldSourceData[i]], this.inputElem[this.ddFieldValue[i]]);
    }
  }

  returnDDData(source, filterValue) {
    for (let item of source) {
      if (item.id == filterValue || item.charityid == filterValue) {
        return item;
      }
    }
    return null;
  }

  setFocus(evt, targetElemId) {
    if (document.getElementById(targetElemId)) {
      document.getElementById(targetElemId).focus();
    }
  }

  amountInputChanged(evt) {
    if (this.inputElem.amount && this.inputElem.amount.value) {
      let amount = parseInt(this.inputElem.amount.value, 10);
      this.inputElem.amount_in_words.value = this.util.toTitleCase(this.util.inWords(amount)).trim();
    }
  }

  charityDDChanged(evt) {
    this.inputElem.charityid = this.inputElem.selCharityData.charityid;
    this.loadCharityDataById();
    this.loadHistoryData();
  }


  loadCharityDataById() {
    this.httpClient.get(ApiConstant.getCharityMasterDataByIdURL + `/${this.inputElem.charityid}`).subscribe((data: any) => {
      this.setCharityMasterData(data.data);
      this.validate();
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading charity master data by its id for edit purpose!'
      });
    });
  }

  loadHistoryData() {
    // getCharityTransactionsDataByIdURL
    let paramObj = {
      "transnolist": [],
      "charityidlist": [this.inputElem.charityid ? '' + this.inputElem.charityid : ''],
      "orgid": [this.inputElem.orgid ? '' + this.inputElem.orgid : ''],
      "finyearid": [this.inputElem.finyearid ? '' + this.inputElem.finyearid : '']
    }
    this.httpClient.post(ApiConstant.findMultipleTransFilter, paramObj).subscribe((data: any) => {
      this.setCharityHistoryData(data.data);
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading charity master data by its id for edit purpose!'
      });
    });
  }

  setCharityHistoryData(data) {
    for (let item of data) {
      for (let item1 of this.paymentModeData) {
        if (item.modeofpay === item1.id) {
          item.modeofpayName = item1.value;
        }
      }
    }
    this.historyData = data;
  }

  setCharityMasterData(data) {
    this.inputElem.ein.value = data.ein;
    this.inputElem.contactname.value = data.contactname;
    this.inputElem.address1.value = data.address1;
  }

  orgDDChanged(evt) {
    this.inputElem.orgid = this.inputElem.selOrgData.id;
  }

  finYearDDChanged(evt) {
    this.inputElem.finyearid = this.inputElem.selFinYearData.id;
  }

  paymentModeDDChanged(evt) {
    this.inputElem.modeofpay = this.inputElem.selPaymentMode.id;
  }

  reset() {
    this.isSubmiting = false;
    // tslint:disable-next-line: forin
    for (const key in this.inputElem) {
      if (this.noObjList.indexOf(key) > -1) {
        this.inputElem[key] = null;
      } else {
        this.inputElem[key].value = '';
      }
    }
    this.resetDDData();
  }

  resetDDData() {
    this.inputElem.selCharityData = null;
    this.inputElem.selOrgData = null;
    this.inputElem.selFinYearData = null;
    this.inputElem.selPaymentMode = null;
  }

  cancel(evt?: any) {
    this.reset();
    this.broadcast.broadcast(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CLOSE, { name: this.ddName, force: true });
  }

  validate() {
    let isFlag = true;
    // tslint:disable-next-line: forin
    for (const key in this.inputElem) {
      if (this.impFieldList.indexOf(key) === -1 && this.noObjList.indexOf(key) === -1 &&
        this.inputElem[key].value === '') {
        isFlag = true;
        break;
      }
    }
    this.isValid = isFlag;
  }

  setParam() {
    // tslint:disable-next-line: forin
    for (const key in this.inputElem) {
      if (this.ddFields.indexOf(key) === -1) {
        if (this.noObjList.indexOf(key) > -1) {
          this.paramObj[key] = this.inputElem[key];
        } else {
          this.paramObj[key] = this.inputElem[key].value;
        }
      }
    }
    this.paramObj.createdate = moment();
    this.paramObj.srno = this.srno || null;
  }

  setLatiLongiParam() {
    // tslint:disable-next-line: no-string-literal
    this.paramObj['gpsLocLatLong'] = this.inputElem['latitude'].value + ' ' + this.inputElem['longitude'].value;
  }

  submitData(opt?: any) {
    if (this.isSubmiting) {
      return;
    }

    this.isSubmiting = true;

    this.httpClient.post(ApiConstant.saveCharityTransactionsDataURL, this.paramObj).subscribe((data) => {
      this.isSubmiting = false;
      if (this.isForEdit) {
        this.updateListingRow(data);
      } else {
        this.addNewDataInListing(data);
      }
      this.util.notification.success({
        title: 'Success',
        msg: 'Charity Transactions Details Saved Successfully.'
      });
      if (opt && opt.isReqToKeepOpen) {
        this.reset();
      } else {
        this.cancel();
      }
    }, (err) => {
      this.isSubmiting = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving charity transactions details!'
      });
    });
  }

  updateListingRow(data) {
    this.onUpdateSuccess.emit(data);
  }

  addNewDataInListing(data) {
    if (data && data.data) {
      this.onAddSuccess.emit({});
    }
  }

  submit(evt?: any) {
    this.validate();
    if (this.isValid) {
      this.setParam();
      this.submitData();
    }
  }

  saveContinue(evt?: any) {
    this.validate();
    if (this.isValid) {
      this.setParam();
      this.submitData({
        isReqToKeepOpen: true
      });
    }
  }

}
