import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { ExcelService } from '../../shared/excel.service';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import { CHARITY_MASTER_COLUMN_HEADER } from './charity-master-column.enum';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  @ViewChild('mainSection', { static: false }) $mainSection: any;

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;
  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;

  activeListing: any = {};
  public appType: Number = AppConstant.CHARITY_MASTER_APP_TYPE;
  public listingTemplate: any = {};
  groupData: any;
  name = 'Angular';
  data: any;
  public filterList: any = [
    {
      id: 'CMF01',
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
    }
  ];
  public isFilterDataLoaded: boolean = false;

  private sampleData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private filterParam: any = {
    charityid: [],
    orgFullName: [],
    charityNames: [],
    isFilterApplied: false
  };

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private excelService: ExcelService
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
    this.listen();
    this.loadFilterDDData();
    this.loadData();
  }

  loadData(apiURL?: string, params?: any) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const url = apiURL || ApiConstant.getAllCharityMasterDataURL + `?page=${this.currentPageNo}&size=${this.pageSize}`;

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
        msg: 'Error while loading Charity Master Details!'
      })
    })
  }

  loadFilteredData(opt) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    let paramObj = {
      "charitynamelist": opt.charityNameList
    }
    this.httpClient.post(ApiConstant.filterByCharityMasterIdURL, paramObj).subscribe((data: any) => {
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
        msg: 'Error while loading Charity Master Details!'
      })
    });
  }

  loadFilterDDData() {
    this.httpClient.get(ApiConstant.getCharityNameForFilterURL).subscribe((data: any) => {
      this.manipulateCharityCode(data.data);
      this.isFilterDataLoaded = true;
    }, (err: any) => {
      this.isFilterDataLoaded = false;
    })
  }

  manipulateCharityCode(data) {
    const rowData = data;
    this.filterList[0].data = [];
    for (let i = 0; i < rowData.length; i++) {
      if (rowData[i]) {
        this.filterList[0].data.push({
          id: rowData[i].charityid,
          isSelect: false,
          value: rowData[i].charityname
        });
      }

    }
    this.filterList[0].isDataLoaded = true;
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
    this.sampleData.listingType = AppConstant.CHARITY_MASTER_LISTING_TYPE;
    this.sampleData.recordBatchSize = resData.size || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'charityid';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.totalElements || resData.length;
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData.content || resData.allClientList || resData || [];
    if (colData.length) {
      const rowData = colData[0];
      this.sampleData.columnHeader.push(CHARITY_MASTER_COLUMN_HEADER['checkbox']);
      for (let key in rowData) {
        CHARITY_MASTER_COLUMN_HEADER[key] && this.sampleData.columnHeader.push(CHARITY_MASTER_COLUMN_HEADER[key]);
      }
    }
  }

  setRowData(resData) {
    this.sampleData.data = resData.content || resData.allClientList || resData || [];
  }

  updateFilterParam(fData) {
    if (fData.popupTo.data && fData.popupTo.data.length) {
      this.filterParam[fData.fieldName] = fData.popupTo.data.map((item) => {
        return item.value;
      });
    } else {
      this.filterParam[fData.indexField] = null;
    }
  }

  applyFilter(fData) {
    this.updateFilterParam(fData);
    const charityNames = this.filterParam.charityid;
    // const orgFullnames = this.filterParam.orgFullName ? this.filterParam.orgFullName.join(',') : '';
    if (charityNames) {
      this.loadFilteredData({
        charityNameList: charityNames
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
    this.loadData();
  }

  delete(evt) {
    var r = confirm("Are you sure you want to delete selected record");
    if (this.multipleSelRow && r) {
      const charityid = this.multipleSelRow.map((item) => {
        return item.charityid;
      }).join(",");
      this.httpClient.get(ApiConstant.deleteCharityMasterDataURL + `/${charityid}`).subscribe((data) => {
        this.util.notification.success({
          title: 'Success',
          msg: 'Charity master details deleted successfully.'
        });
        this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while deleting charity master details!'
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
        this.broadcast.broadcast(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CLOSE, { name: 'editMasterDetails', force: true })
      } else {
        this.selectedRow = data;
        this.broadcast.broadcast(AppConstant.CHARITY_MASTER.LOAD_DATA_FOR_EDIT, data);
      }
    } else {
      this.multipleSelRow = null;
      this.selectedRow = null;
    }
  }

  updateListingData(rows) {
    this.tableListingComponent.updateSelectedRow(rows);
    this.loadData();
  }

  //start Code for Export to Excel
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'charity_master');
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
