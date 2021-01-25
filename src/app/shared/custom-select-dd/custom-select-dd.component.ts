import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonUtilService } from "../common-util.service";
import { ApiConstant } from '../api-constant.enum';
import { AppConstant } from '../app-constant.enum';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { BroadcastService } from '../broadcast.service';

@Component({
  selector: 'app-custom-select-dd',
  templateUrl: './custom-select-dd.component.html',
  styleUrls: ['./custom-select-dd.component.scss']
})
export class CustomSelectDdComponent implements OnInit, OnDestroy {

  @ViewChild('dropDown', { static: true }) dropDown: NgbDropdown;

  @ViewChild('$searchInput', { static: true }) $searchInput: ElementRef;

  @Input('isOpen') isOpen: any;
  
  @Input('placement') placement: any = ['bottom-left', 'bottom-right'];

  @Input('hideTriggerEl') hideTriggerEl: boolean = false;

  @Input('ddData') ddData: any;

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() onDropdownClose: EventEmitter<any> = new EventEmitter<any>();

  backup = undefined;

  dd: any = {
    dynamic: false,
    limited: true,
    text: '',
    title: "",
    list: {
      xhr: false,
      searchxhr: false,
      data: []
    },
    search: {
      value: ""
    }
  };

  private $: any = window['jQuery'];
  private selection = [];
  private isDirty = false;
  private sub1: Subscription;

  constructor(
    private util: CommonUtilService,
    private httpClient: HttpClient,
    private broadcast: BroadcastService
  ) { }

  listen() {
    this.sub1 = this.broadcast.on<string>('CLEAR_FILTER_SELECTION').subscribe((item: any) => {
      if(this.ddData.indexField === item.indexField) {
        this.clear();
      }
    });
  }

  ngOnInit() {
    this.listen();
    this.init();
    this.setPopupTo();

    if (this.isOpen) {
      setTimeout(() => {
        this.dropDown.open();
      })
    }
  }

  ngOnDestroy() {
    if(this.dropDown.isOpen) {
      this.onToggle(false);
      return;
    }
    this.sub1.unsubscribe();
    this.cancelListXHR();
    this.cancelSearchXHR();
  }

  init() {
    if (this.ddData.data && this.ddData.data.length) {
      this.dd.dynamic = false;
      this.dd.list.data = this.ddData.data;
    } else {
      this.dd.dynamic = true;
    }

    if (this.ddData.labelName) {
      this.dd.suggestionLabel = this.util.lang.get('suggested') + ' ' + this.ddData.labelName
    }
  }
  
  private cancelListXHR() {
    if(this.dd.list.xhr) {
      this.dd.list.xhr.unsubscribe && this.dd.list.xhr.unsubscribe();
      this.dd.list.xhr = false;
    }
  }
  
  private cancelSearchXHR() {
    if(this.dd.list.searchxhr) {
      this.dd.list.searchxhr.unsubscribe && this.dd.list.searchxhr.unsubscribe();
      this.dd.list.searchxhr = false;
    }
  }

  private setPopupTo() {
    // get saved selection
    if (this.ddData && this.ddData.popupTo && this.ddData.popupTo.data && this.ddData.popupTo.data.length) {
      this.dd.list.data = this.ddData.popupTo.data || [];
      this.setSelection(this.dd.list.data);
    } else {
      this.setTitle(this.selection);
    }
  };

  private getPopupTo(rbs) {
    let defData = { recordBatchSize: rbs, data: [] };

    if (!this.selection || !this.selection.length) {
      return defData;
    }

    defData.data = this.selection;
    return defData;
  };

  private setSearchInputFocus() {
    setTimeout(() => {
      this.$searchInput && this.$(this.$searchInput.nativeElement).focus();
    }, 0);
  }

  private loadData(fromSearch = false, all?) {
    if (!this.dd.dynamic) {
      this.showSelectedOnTop();
      this.setSearchInputFocus();
      return;
    }

    this.cancelListXHR();
    this.cancelSearchXHR();

    let ddData = this.ddData;
    let rbs = (all ? '-1' : 25);
    let param: any = {
      recordBatchSize: rbs,
      ddData
    };

    if (this.dd.search.value) {
      param.searchValue = this.dd.search.value;
    }

    let xhr = this.httpClient.get(ApiConstant.getAllCharityMasterDataURL).subscribe((response: any) => {
      
      this.dd.list.xhr = false;
      this.dd.list.searchxhr = false;

      this.dd.list.data = response.body.data || [];

      if (this.selection.length) {
        for (let i = 0; i < this.dd.list.data.length; i++) {
          const element = this.dd.list.data[i];
          this.selection.filter((data) => {
            return data.id == element.id;
          }).length && (element.isSelected = true);
        }
      }

      this.setSelection(this.dd.list.data);
      this.setSearchInputFocus();
    }, (error) => {
      this.dd.list.searchxhr = false;
    });

    let setXhr = () => {
      if (this.dd.search.value) {
        this.dd.list.searchxhr = xhr;
      } else {
        this.dd.list.xhr = xhr;
      }
    };

    setXhr();
  };

  /**
   * @description Search inside dropdown list
   * @private
   * @returns
   * @memberof FilterDdComponent
   */
  private searchInner() {
    if (!this.dd.search.value) {
      this.showSelectedOnTop();

      if (this.backup && this.backup.length) {
        this.dd.list.data = this.backup;
        this.backup = undefined;
      }

      if (this.dd.list.searchxhr) {
        this.dd.list.searchxhr.unsubscribe && this.dd.list.searchxhr.unsubscribe();
        this.dd.list.searchxhr = false;
      }

      return;
    }

    if (!this.backup || !this.backup.length) {
      this.backup = this.dd.list.data;
    }

    if (this.dd.dynamic) {
      this.loadData(true);
    } else {
      let filtered = [];
      if (!this.dd.search.value) {
        filtered = this.backup;
      } else {
        filtered = this.backup.filter((data) => {
          return data.value.toLowerCase().indexOf(this.dd.search.value.toLowerCase()) > -1;
        });
      }

      this.dd.list.data = filtered;

      if (this.selection.length) {
        for (let i = 0; i < this.dd.list.data.length; i++) {
          const element = this.dd.list.data[i];
          this.selection.filter((data) => {
            return data.id == element.id;
          }).length && (element.isSelected = true);
        }
      }

      this.setSelection(this.dd.list.data);
    }
  };

  /**
   * @description Remove duplicate from list
   * @private
   * @returns
   * @memberof FilterDdComponent
   */
  private uniqueList() {
    if (!this.selection || !this.selection.length) {
      return;
    }

    let ids = [];
    let array = [];
    for (let i = 0; i < this.selection.length; i++) {
      let item = this.selection[i];
      if (ids.indexOf(item.id) == -1) {
        array.push(item);
      }

      ids.push(item.id);
    }

    this.selection = array;
  };

  /**
   * @description Set title of dropdown button
   * @private
   * @param {*} array
   * @returns
   * @memberof FilterDdComponent
   */
  private setTitle(array) {
    // get saved selection
    let all = this.util.lang.get('all');
    
    if (!array || !array.length) {
      this.dd.title = all;
      this.dd.text = all;
      return;
    }

    let title = [];
    for (let i = 0; i < array.length; i++) {
      title.push(array[i].value);
    }

    this.dd.title = title.join(',\n') || all;
    this.dd.text = title.join(', ') || all;
  }

  /**
   * @description Set already selected data
   * @private
   * @param {*} array
   * @returns
   * @memberof FilterDdComponent
   */
  private setSelection(array) {
    // get saved selection
    if (!array || !array.length) {
      this.setTitle(this.selection);
      return;
    }

    let title = [];
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if (item.isSelected) {
        this.selection.push(item);
        title.push(item.value);
      }
    }

    if (this.selection.length) {
      this.ddData.hasValue = true;
    } else {
      delete this.ddData.hasValue;
    }

    this.showSelectedOnTop();
    this.setTitle(this.selection);
  };

  /** 
   * @description Sort dropdown list
   * @private
   * @param {*} array
   * @param {*} key
   * @returns
   * @memberof FilterDdComponent
   */
  private orderBy(array, key) {
    if (!array || array.length < 2) {
      return array;
    }

    return array.sort(function (a, b) {
      var nameA = a[key].toUpperCase();
      var nameB = b[key].toUpperCase();
      if(nameA == 'BLANK(--)') {
        nameA = '';
      }
      if(nameB == 'BLANK(--)') {
        nameB = '';
      }

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }

  /**
   * @description Filter selected data and show on top
   * @private
   * @returns
   * @memberof FilterDdComponent
   */
  private showSelectedOnTop() {
    this.uniqueList();
    this.selection = this.orderBy(this.selection, 'value');

    let list = this.backup || this.dd.list.data;
    if (!list || !list.length) {
      return;
    }

    let ids = [], array = [], item, i;

    for (i = 0; i < this.selection.length; i++) {
      item = this.selection[i];
      ids.push(this.selection[i].id);
    }

    for (i = 0; i < list.length; i++) {
      item = list[i];
      if (ids.indexOf(item.id) == -1) {
        item.isSelected = false;
        array.push(item);
      }
    }

    array = this.orderBy(array, 'value');
    array = this.selection.concat(array);

    if (this.backup) {
      this.backup = array;
    } else {
      this.dd.list.data = array;
    }
  };

  private typeTimeout = undefined;
  /**
   * @description search dropdown value server call
   * @returns
   * @memberof FilterDdComponent
   */
  search() {
    if (!this.dd.dynamic || !this.dd.search.value) {
      this.searchInner();
      return;
    }

    clearTimeout(this.typeTimeout);
    this.typeTimeout = setTimeout(() => {
      this.searchInner();
    }, 400);
  };

  /**
   * @description On select/deselect callback
   * @param {*} open
   * @memberof FilterDdComponent
   */
  onToggle(open) {
    if (open) {
      this.loadData();
    } else {
      this.clearSearch();
      this.dd.limited = true;

      this.cancelListXHR();
      this.cancelSearchXHR();
      
      if (this.isDirty) {
        this.ddData.popupTo.data = (this.selection && this.selection.length) ? this.selection : [];

        if (this.selection.length) {
          this.ddData.hasValue = true;
        } else {
          delete this.ddData.hasValue;
        }

        this.onSelectionChange.emit(this.ddData);
        this.isDirty = false;
      }
    }
  };

  /**
   * @description On selection
   * @param {*} item
   * @memberof FilterDdComponent
   */
  select(item) {
    item.isSelected = !item.isSelected;

    // set dirty flag
    if (!this.isDirty) {
      this.isDirty = true;
    }

    if (item.isSelected) {
      this.selection.push(item);
      this.uniqueList();
    } else {
      for (let i = 0; i < this.selection.length; i++) {
        let sitem = this.selection[i];
        if (item.id == sitem.id) {
          this.selection.splice(i, 1);
          break;
        }
      }
    }

    this.setTitle(this.selection);
  };

  /**
   * @description On show button click callback
   * @memberof FilterDdComponent
   */
  showAll() {
    this.dd.limited = false;
    this.loadData(false, true);
  };

  /**
   * @description Clear last search
   * @returns
   * @memberof FilterDdComponent
   */
  clearSearch() {
    if (this.dd.list.searchxhr || !this.dd.search.value) {
      return;
    }

    this.dd.search.value = '';
    this.showSelectedOnTop();

    if (this.backup && this.backup.length) {
      this.dd.list.data = this.backup;
      this.backup = undefined;
    }
  };

  /**
   * @description Clear all
   * @returns
   * @memberof FilterDdComponent
   */
  clear() {
    if (!this.dd.list.data || !this.dd.list.data.length) {
      return;
    }

    for (let i = 0; i < this.dd.list.data.length; i++) {
      let item = this.dd.list.data[i];
      item.isSelected = false;
    }

    this.selection = [];
    this.setTitle(this.selection);

    this.isDirty = true;
  };

  /**
   * @description Track list by id
   * @param {*} h
   * @returns
   * @memberof FilterDdComponent
   */
  trackBy(h) {
    return h.id;
  }

  /**
   * @description Close dropdown
   * @returns
   * @memberof FilterDdComponent
   */
  closeDropdown() {
    this.dropDown.close();
    this.onDropdownClose.emit();
  }

}
