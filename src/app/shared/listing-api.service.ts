import { Injectable } from '@angular/core';

import { CommonUtilService } from './common-util.service';
import { AppConstant } from './app-constant.enum';
import { ApiConstant } from './api-constant.enum';

@Injectable({
  providedIn: 'root'
})
export class ListingApiService {

  retainNoOfShow: number = window['retainNoOfShow'] || 10;
  lazyLoadBatchSize: number = this.retainNoOfShow;

  private $: any = window['$'];

  constructor(
    private util: CommonUtilService
  ) { }

  removeSelected_Assoc(array, el, index, callback) {
    if (!array) {
      return;
    }

    if (el === 'all') {
      array.length = 0;
    } else {
      el.closest('.repeated-item').remove();
      // tslint:disable-next-line: no-unused-expression
      array && array.splice(index, 1);
    }

    // tslint:disable-next-line: no-unused-expression
    callback && callback(array, el, index);
  }

  getColumnDataByFieldName(columns, fieldName) {
    if (!columns || !columns.length) {
      return {};
    }
    const filtered = columns.filter((val) => {
      return val.fieldName === fieldName;
    });
    if (!filtered.length) {
      return {};
    }
    return filtered[0];
  }

}
