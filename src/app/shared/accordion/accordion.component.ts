import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PdfViewerComponent } from "ng2-pdf-viewer";
import { ApiConstant } from '../api-constant.enum';
import { CommonUtilService } from '../common-util.service';

import * as moment from 'moment';
import 'moment-duration-format';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  providers: [PdfViewerComponent ]
})
export class AccordionComponent implements OnInit, OnDestroy {

  @Input() isAutoUpload: boolean = false;

  @Input() uploadAPI: string = ApiConstant.uploadFilePDFFeasibilitySurvey;

  // Two-way bindings
  listItem: any;
  @Input()
  get listItemData() {
    return this.listItem;
  }
  @Output() listItemDataChange = new EventEmitter();
  // tslint:disable-next-line: adjacent-overload-signatures
  set listItemData(val) {
    this.listItem = val;
    this.listItemDataChange.emit(this.listItem);
  }

  @Output() onFileUpload: EventEmitter<any> = new EventEmitter<any>();

  private fileList: any = [];

  constructor(
    private util: CommonUtilService
  ) { }

  ngOnInit(): void {
    moment.locale('engb');
  }

  ngOnDestroy() {

  }

  toggle(evt?: any, item?: any) {
    item.isOpen = !item.isOpen;
  }

  handleFile(evt?: any, item?: any, category?: any) {
    const fileObj = evt.target.files[0];
    if (item.isUploading) {
      return;
    }
    if (item.uploadFileType === 'docimg' && !(fileObj.type === 'application/pdf' || ['image/jpeg', 'image/jpg', 'image/png'].indexOf('image/png') > -1)) {
      this.util.notification.warn({
        title: 'Warning!',
        msg: 'Please select pdf or [jpeg | jpg | png] file only.'
      });
      return;
    } else if (item.uploadFileType === 'documents' && fileObj.type !== 'application/pdf') {
      this.util.notification.warn({
        title: 'Warning!',
        msg: 'Please select pdf file only.'
      });
      return;
    } else if (item.uploadFileType === 'photos' && ['image/jpeg', 'image/jpg', 'image/png'].indexOf('image/png') === -1) {
      this.util.notification.warn({
        title: 'Warning!',
        msg: 'Please select [jpeg | jpg | png] file only.'
      });
      return;
    }
    item.fileData = fileObj;
    item.fileName = fileObj.name;
    item.type = fileObj.type;
    item.isUploaded = false;
    category.fileList.push(item);
    if (this.isAutoUpload) {
      this.uploadFile(null, item);
    }
  }

  uploadAll(evt?: any, catItem?: any) {
    // tslint:disable-next-line: prefer-const
    for (let item of catItem.fileList) {
      if (!item.isDownloadFile && !item.docsPhotoUrl) {
        this.uploadFile(null, item);
      }
    }
  }

  resetAll(evt?: any, catItem?: any) {
    const removeChildFileData = (childItems) => {
      // tslint:disable-next-line: prefer-const
      for (let cItem of childItems) {
        // tslint:disable-next-line: prefer-const
        for (let pItem of cItem.placeHolder) {
          delete pItem.fileData;
          delete pItem.fileName;
          delete pItem.isUploaded;
          pItem.docsPhotoUrl = null;
        }
        cItem.fileList = [];
      }
      if (childItems.children && childItems.children.length) {
        removeChildFileData(childItems);
      }
    };
    removeChildFileData(catItem.children);
    // tslint:disable-next-line: prefer-const
    for (let item of catItem.placeHolder) {
      delete item.fileData;
      delete item.fileName;
      delete item.isUploaded;
      item.docsPhotoUrl = null;
    }
    catItem.fileList = [];
    this.onFileUpload.emit({
      data: {
        isUploading: false
      }
    });
  }

  uploadFile(evt?: any, item?: any) {
    if (!item.fileData) {
      this.util.notification.warn({
        title: 'Warning!',
        msg: 'Please select file to upload'
      });
      return;
    }
    item.isUploading = true;
    this.onFileUpload.emit({
      data: {
        isUploading: true
      }
    });
    this.util.uploadPDFFile(this.uploadAPI, item.fileData).subscribe((res: any) => {
      item.isSelectFile = false;

      item.isUploading = false;
      item.isDownloadFile = true;
      item.isUploaded = true;
      item.docsPhotoUrl = res.fileUrl;
      delete item.fileData;
      this.onFileUpload.emit({
        data: {
          isUploading: false
        }
      });
    }, error => {
      item.isUploading = false;
      item.isDownloadFile = false;
      item.isUploaded = false;
      this.onFileUpload.emit({
        data: {
          isUploading: false
        }
      });
      this.util.notification.error({
        title: 'Error',
        msg: error.message || 'Error while uploading PDF'
      });
    });
  }

  download(evt?: any, item?: any) {
    return true;
  }

  cancelItem(evt?: any, item?: any) {
    item.isSelectFile = false;
    item.isDownloadFile = true;
  }

  changeItem(evt?: any, item?: any) {
    item.isSelectFile = true;
    item.isDownloadFile = false;
  }

  setFocus(evt, targetElemId) {
    document.getElementById(targetElemId).focus();
  }

  dateTimeChange(evt?: any) {
    // this.setDurationValue();
  }

}
