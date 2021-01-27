import { Component, OnInit, Input, OnDestroy, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import * as moment from 'moment';
import 'moment-duration-format';


@Component({
  selector: 'app-add-master',
  templateUrl: './add-master.component.html',
  styleUrls: ['./add-master.component.scss']
})
export class AddMasterComponent implements OnInit, OnDestroy {

  @Input() isForEdit = false;
  @Input() selectedRow: any = null;

  @ViewChild('element', { static: true }) $element: any;

  @Output() onAddSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output() onUpdateSuccess: EventEmitter<any> = new EventEmitter<any>();

  public isValid = false;
  public isSubmiting = false;
  public isLoading = false;
  public isLoadingError = false;

  public inputElem: any = {
    charityname: {
      value: '',
      isFocus: false,
      isLoading: false
    },
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
    dearwhom: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    address1: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    address2: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    city: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    state: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    postalcode: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    emailid1: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    emailid2: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    phone1: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    phone2: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    url: {
      value: '',
      isFocus: false,
      isLoading: false
    },
    remarks: '',
    createdate: moment(),
    createdby: null
  }

  private impFieldList: any = ['charityname', 'ein', 'contactname', 'dearwhom'];
  private noObjList: any = ['remarks', 'createdate', 'createdby'];
  private isPanelOpen = false;
  private paramObj: any = {};
  private $: any = window['jQuery'];
  private ddName = '';
  private charityMasterId: any = 0;
  private editSub: Subscription;
  private editSub1: Subscription;

  constructor(
    private broadcast: BroadcastService,
    private util: CommonUtilService,
    private httpClient: HttpClient
  ) {
  }

  listen() {
    this.editSub = this.broadcast.on<string>(AppConstant.CHARITY_MASTER.LOAD_DATA_FOR_EDIT).subscribe((data: any) => {
      if (this.isPanelOpen && this.isForEdit) {
        this.loadData(data);
      }
    });

    this.editSub1 = this.broadcast.on<string>(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CHANGED).subscribe((data: any) => {
      this.isPanelOpen = data.visible;
      if (data && (data.visible || data.isOpen)) {
        if (this.isForEdit) {
          this.ddName = 'editMasterDetails';
          this.loadData(this.selectedRow);
        } else {
          this.ddName = 'addMasterDetails';
        }
      }
    });
  }

  ngOnInit(): void {
    moment.locale('engb');
    this.init();
    this.listen();
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
    this.editSub1.unsubscribe();
  }

  init() {
    this.listen();
  }

  loadData(selectedRow) {
    if (this.isLoading || !selectedRow || !Object.keys(selectedRow).length) {
      return;
    } else if (!this.isPanelOpen || !this.isForEdit) {
      return;
    }
    this.isLoading = true;
    this.charityMasterId = selectedRow.length && selectedRow[0].charityid;
    this.httpClient.get(ApiConstant.getCharityMasterDataByIdURL + `/${this.charityMasterId}`).subscribe((data: any) => {
      this.isLoading = false;
      this.setData(data);
      this.validate();
    }, (err) => {
      this.isLoading = false;
      this.isLoadingError = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading charity master data by its id for edit purpose!'
      });
    });
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
    this.validate();
  }

  setFocus(evt, targetElemId) {
    document.getElementById(targetElemId).focus();
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
      if (this.noObjList.indexOf(key) > -1) {
        this.paramObj[key] = this.inputElem[key];
      } else {
        this.paramObj[key] = this.inputElem[key].value;
      }
    }
    this.paramObj.charityid = this.charityMasterId || 0;
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

    this.httpClient.post(ApiConstant.saveCharityMasterDataURL, this.paramObj).subscribe((data) => {
      this.isSubmiting = false;
      if (this.isForEdit) {
        this.updateListingRow(data);
      } else {
        this.addNewDataInListing(data);
      }
      this.util.notification.success({
        title: 'Success',
        msg: 'Charity Master Details Saved Successfully.'
      });

       if (opt && opt.isReqToKeepOpen) {
        this.reset();
       // window.location.reload();
      } else {
        this.cancel();
      }
    }, (err) => {
      this.isSubmiting = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving charity master details!'
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
      window.location.reload();
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
