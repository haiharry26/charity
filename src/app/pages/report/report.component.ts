import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { ExcelService } from '../../shared/excel.service';
import { TransactionService } from './report.service';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import { CHARITY_TRANSACTIONS_COLUMN_HEADER } from './charity-transactions-column.enum';

import { organization } from '../data/org';
import { finYear } from '../data/finYear';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
  selector: 'app-transactions',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class TransactionsComponent implements OnInit {

  @ViewChild('mainSection', { static: false }) $mainSection: any;

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;
  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;

  activeListing: any = {};
  public appType: Number = AppConstant.CHARITY_TRANSACTIONS_APP_TYPE;
  public listingTemplate: any = {};
  groupData: any;
  name = 'Angular';
  data: any;
  public filterList: any = [
    {
      id: 'CMF01',
      fieldName: "orgid",
      indexField: "orgid",
      labelName: "Organisation",
      dataType: "Dropdown",
      popupTo: {
        recordBatchSize: 25,
        data: organization.data
      },
      listingColumnFieldName: "orgid",
      data: organization.data,
      isDataLoaded: true,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false
    },
    {
      id: 'CMF02',
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
    },
    {
      id: 'CMF03',
      fieldName: "charityid",
      indexField: "charityid",
      labelName: "Charity Id",
      dataType: "Dropdown",
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: "charityid",
      data: [],
      isDataLoaded: false,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false
    },
    {
      id: 'CMF04',
      fieldName: "transactionsid",
      indexField: "transactionsid",
      labelName: "Transaction Id",
      dataType: "Dropdown",
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: "transactionsid",
      data: [],
      isDataLoaded: false,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false
    }
  ];
  public isFilterDataLoaded: boolean = false;

  private sampleData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private filterParam: any = {
    transactionsid: [],
    charityid: [],
    finyearid: [],
    orgid: []
  };


  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private excelService: ExcelService,
    private tranService: TransactionService
  ) { }

  listen() {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.parentHeight = this.$mainSection.nativeElement.clientHeight;
    }, 100);
    this.init();
  }

  ngOnDestroy() {

  }

  init() {
    this.tranService.initOrgFinYearDDValue();

    this.filterParam.orgid = [this.tranService.selOrgFinYear.orgid];
    this.filterParam.finyearid = [this.tranService.selOrgFinYear.finyearid];

    this.listen();
    this.loadFilterDDData();
    this.loadTransListDDData();
    setTimeout(() => {
      // this.loadData();
      this.loadFilteredData({

      });
    }, 500);
  }

  loadData(apiURL?: string) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const url = apiURL || ApiConstant.getAllCharityTransactionsDataURL + `?page=${this.currentPageNo}&size=${this.pageSize}`;
    this.httpClient.get(url).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulate(data.result || data.data);
      // start code for export to excel
      this.data = data.result || data.data;
      this.groupData = this.organise(this.data);
      // end
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Charity Transactions Details!'
      })
    })
  }

  loadFilteredData(opt) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    let paramObj = {
      "transnolist": opt.transactionsids ? opt.transactionsids.split(',') : [],
      "charityidlist": opt.charityids ? opt.charityids.split(',') : [],
      "orgid": opt.orgids ? opt.orgids.split(',') : (this.filterParam.orgid ? this.filterParam.orgid : []),
      "finyearid": opt.finyearids ? opt.finyearids.split(',') : (this.filterParam.finyearid ? this.filterParam.finyearid : [])
    }
    this.httpClient.post(opt.url || ApiConstant.findMultipleTransFilter, paramObj).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulate(data.result || data.data);
      // start code for export to excel
      this.data = data.result || data.data;
      this.groupData = this.organise(this.data);
      // end
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Charity Transactions Details!'
      })
    });
  }

  sendEmailData(opt?: any)  {

    const transactionsids = this.filterParam.transactionsid ? this.filterParam.transactionsid.join(',') : '';
    const charityids = this.filterParam.charityid ? this.filterParam.charityid.join(',') : '';
    const orgids = this.filterParam.orgid ? this.filterParam.orgid.join(',') : '';
    const finyearids = this.filterParam.finyearid ? this.filterParam.finyearid.join(',') : '';

    let paramObj = {
      "transnolist": transactionsids ? transactionsids.split(',') : [],
      "charityidlist": charityids ? charityids.split(',') : [],
      "orgid": orgids ? orgids.split(',') : (this.filterParam.orgid ? this.filterParam.orgid : []),
      "finyearid": finyearids ? finyearids.split(',') : (this.filterParam.finyearid ? this.filterParam.finyearid : [])
    }
    this.httpClient.post(ApiConstant.sendTranEmail, paramObj).subscribe((data: any) => {
      this.util.notification.success({
        title: 'Success',
        msg: 'Transaction data send for email'
      });
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while sending transactions data as email'
      })
    });
  }

  loadFilterDDData() {
    this.httpClient.get(ApiConstant.getCharityNameForFilterURL).subscribe((data: any) => {
      this.manipulateCharityCode(data.data);
      this.util.setCharityDDData(data.data);
      this.isFilterDataLoaded = true;
    }, (err: any) => {
      this.isFilterDataLoaded = false;
    })
  }


  loadTransListDDData() {
    this.httpClient.post(ApiConstant.getListTrans, {
      orgid: [this.tranService.selOrgFinYear.orgid],
      finyearid: [this.tranService.selOrgFinYear.finyearid]
    }).subscribe((data: any) => {
      this.manipulateTransList(data.data);
      this.isFilterDataLoaded = true;
    }, (err: any) => {
      this.isFilterDataLoaded = false;
    })
  }

  manipulateCharityCode(data) {
    const rowData = data;
    this.filterList[2].data = [];
    for (let i = 0; i < rowData.length; i++) {
      if (rowData[i]) {
        this.filterList[2].data.push({
          id: rowData[i].charityid,
          isSelect: false,
          value: rowData[i].charityname
        });
      }
    }
    this.filterList[2].isDataLoaded = true;
  }

  manipulateTransList(data) {
    const rowData = data;
    this.filterList[3].data = [];
    for (let i = 0; i < rowData.length; i++) {
      if (rowData[i]) {
        this.filterList[3].data.push({
          id: rowData[i].srno,
          isSelect: false,
          value: rowData[i].srno
        });
      }
    }
    this.filterList[3].isDataLoaded = true;
  }

  manipulate(data) {
    // start code export to excel
    this.data = data.content;
    // end
    this.setResponse(data);
    this.setColumnHeader(data);
    this.setRowData(data);
    this.activeListing.list = this.sampleData;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.CHARITY_TRANSACTIONS_LISTING_TYPE;
    this.sampleData.recordBatchSize = resData.size || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'srno';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.totalElements || resData.length;
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData.content || resData.allClientList || resData || [];
    if (colData.length) {
      const rowData = colData[0];
      this.sampleData.columnHeader.push(CHARITY_TRANSACTIONS_COLUMN_HEADER['checkbox']);
      for (let key in rowData) {
        if (key === 'charityid') {
          this.sampleData.columnHeader.push(CHARITY_TRANSACTIONS_COLUMN_HEADER['charityname']);
        } else if (CHARITY_TRANSACTIONS_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(CHARITY_TRANSACTIONS_COLUMN_HEADER[key]);
        }
      }
    }
  }

  setRowData(resData) {
    const data = resData.content || resData.allClientList || resData || [];;
    if (data.length) {
      for (let item of data) {
        for (let key in item) {
          if (key === 'charityid') {
            item['charityname'] = this.returnCharityNameById(item);
          }
        }
      }
      this.sampleData.data = data;
    } else {
      this.sampleData.data = [];
    }
  }

  returnCharityNameById(data) {
    for (let item of this.filterList[2].data) {
      if (item.id == data.charityid) {
        return item.value;
        break;
      }
    }
    return '';
  }

  updateFilterParam(fData) {
    if (fData.popupTo.data && fData.popupTo.data.length) {
      this.filterParam[fData.fieldName] = fData.popupTo.data.map((item) => {
        return item.id;
        this.loadListingData();
      });
    } else {
      this.filterParam[fData.indexField] = null;
    }
  }

  applyFilter(fData) {
    this.updateFilterParam(fData);
    this.loadListingData();
  }

  loadListingData(opt?: any) {
    const transactionsids = this.filterParam.transactionsid ? this.filterParam.transactionsid.join(',') : '';
    const charityids = this.filterParam.charityid ? this.filterParam.charityid.join(',') : '';
    const finyearids = this.filterParam.finyearid ? this.filterParam.finyearid.join(',') : '';
    const orgids = this.filterParam.orgid ? this.filterParam.orgid.join(',') : '';
    if (transactionsids || charityids || finyearids || orgids) {
      this.loadFilteredData({
        transactionsids,
        charityids,
        orgids,
        finyearids
      });
    } else {
      this.loadData();
    }
  }

  updateListParam(data) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo - 1) : this.currentPageNo;
    this.pageSize = data.pageSize || this.pageSize;
    this.recordStartFrom = data.recordStartFrom || this.recordStartFrom;

    if (data && data.popupTo) {
      this.applyFilter(data);
    } else {
      this.loadData();
    }
  }

  loadListing(data) {
    this.updateListParam(data);
    // this.loadListingData();
  }

  delete(event) {
    var r = confirm("Are you sure you want to delete selected record");
    if (this.multipleSelRow && r) {
      const srno = this.multipleSelRow.map((event) => {
        return event.srno;
      }).join(",");
      this.httpClient.get(ApiConstant.deleteCharityTransactionsDataURL + `/${srno}`).subscribe((data) => {
        this.util.notification.success({
          title: 'Success',
          msg: 'Charity transactions details deleted successfully.'
        });
        this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while deleting charity transactions details!'
        })
      });
    }
  }

  onRowSelectionChanged(data) {
    // const selData = this.tableListingComponent.getSelectionData()
    if (data && data.length) {
      this.isMultipleRowSelected = data.length > 1;
      this.multipleSelRow = data;
      if (this.isMultipleRowSelected) {
        this.selectedRow = null;
        this.broadcast.broadcast(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CLOSE, { name: 'editCharityTransactionsDetails', force: true })
      } else {
        this.selectedRow = data;
        this.broadcast.broadcast(AppConstant.CHARITY_TRANSACTIONS.LOAD_DATA_FOR_EDIT, data);
      }
    } else {
      this.multipleSelRow = null;
      this.selectedRow = null;
    }
  }

  updateListingData(rows) {
    this.tableListingComponent.updateSelectedRow(rows);
  }

  //start Code for Export to Excel
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'charity_master');
  }

  sendEmail(): void {
    this.sendEmailData();
  }

  organise(arr) {
    var headers = [], // an Array to let us lookup indicies by group
      objs = [],    // the Object we want to create
      i, j;
    for (i = 0; i < arr.length; ++i) {
      j = headers.indexOf(arr[i].id); // lookup
      if (j === -1) { // this entry does not exist yet, init
        j = headers.length;
        headers[j] = arr[i].id;
        objs[j] = {};
        objs[j].id = arr[i].id;
        objs[j].data = [];
      }
      objs[j].data.push( // create clone
        {
          case_worked: arr[i].case_worked,
          note: arr[i].note, id: arr[i].id
        }
      );
    }
    return objs;
  }

}
