import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { CommonUtilService } from '../common-util.service';

@Component({
  selector: 'app-repeator-elements',
  templateUrl: './repeator-elements.component.html',
  styleUrls: ['./repeator-elements.component.scss']
})
export class RepeatorElementsComponent implements OnInit {

  @Input() maxRowLimit: number = 30;
  @Input() metaData: any = null;

  @ViewChild('element', { static: true }) $element: any;

  private $: any = window['jQuery'];
  private cloneRowData: any = null;

  // Two-way bindings 
  listItem: any;
  @Input()
  get listItemData() {
    return this.listItem;
  }
  @Output() listItemDataChange = new EventEmitter();
  set listItemData(val) {
    this.listItem = val;
    this.listItemDataChange.emit(this.listItem);
  }

  constructor(
    private util: CommonUtilService
  ) { }

  ngOnInit(): void {
    this.init();
    this.bindEvent();
  }

  init() {
    this.cloneRowData = this.util.makeSepRefOfObj(this.listItem.rowData[0]);;
  }

  onBodyScroll(gbodyDom, ghead, gbody) {
    ghead.scrollLeft(gbody.scrollLeft());
  }

  bindEvent() {
    const self = this;
    const elBody = this.$(this.$element.nativeElement).find('.gbody');
    this.$(this.$element.nativeElement).find('.gbody').unbind('scroll').bind('scroll', () => {
      self.onBodyScroll(elBody[0], elBody.prev(), elBody);
    });
  }

  addNewRow(evt) {
    if(this.listItem.rowData.length >= this.maxRowLimit) {
      return;
    }
    const obj = this.util.makeSepRefOfObj(this.cloneRowData);;
    this.listItem.rowData.push(obj);
  }

  removeRow(evt?: any, index?: Number) {
    const rowData = this.listItem.rowData;
    if (rowData.length === 1) {
      return;
    }

    for (let i=0;i<rowData.length;i++) {
      if(i === index) {
        rowData.splice(i,1);
        break;
      }
    }
  }

}
