import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateParserFormatter, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtilService } from './common-util.service';

@Injectable({
  providedIn: 'root'
})
export class CustomDatepickerService extends NgbDatepickerI18n {

  locale: string = 'en_GB';

  I18N_VALUES = {
    [this.locale]: {
      weekdays: this.util.lang.get("abbr-sort-day-name-array").split(','),
      months: this.util.lang.get("abbr-month-array").split(','),
    }
  };

  constructor(private util: CommonUtilService) {
    super();
    this.I18N_VALUES[this.locale].weekdays.push(this.I18N_VALUES[this.locale].weekdays.shift());
  }

  getWeekdayShortName(weekday: number): string {
    return this.I18N_VALUES[this.locale].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return this.I18N_VALUES[this.locale].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
  getDayAriaLabel(date: NgbDateStruct): string {
    let dateObj = new Date(date.year, date.month - 1, date.day);
    return this.util.formatDate(this.util.userDateFormat, dateObj);
  }
}

@Injectable()
export class I18nDateParserFormatter extends NgbDateParserFormatter {

  constructor(private util: CommonUtilService) {
    super();
  }

  parse(value: string): NgbDateStruct {
    if (value) {
      try {
        let dateObj = this.util.parseDate((this.util.userDateFormat || 'dd-M-yy'), value);
        return { year: dateObj.getFullYear(), month: dateObj.getMonth() + 1, day: dateObj.getDate() };
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }
    let dateObj = new Date(date.year, date.month - 1, date.day);
    let formatedDate = this.util.formatDate(this.util.userDateFormat, dateObj);
    return formatedDate;
  }
}

@Injectable()
export class DatepickerUtil {

  constructor(private util: CommonUtilService) { }

  getNgbDateObject(value): NgbDateStruct {
    if (value) {
      try {
        let dateObj = new Date(parseInt(value));
        return { year: dateObj.getFullYear(), month: dateObj.getMonth() + 1, day: dateObj.getDate() };
      } catch (e) {
        return { year: null, month: null, day: null };
      }
    }
    return { year: null, month: null, day: null };
  }

  getNgbDateObjectFromString(value): NgbDateStruct {
    if (value) {
      try {
        let dateObj = this.util.parseDate(this.util.userDateFormat, value);
        return { year: dateObj.getFullYear(), month: dateObj.getMonth() + 1, day: dateObj.getDate() };
      } catch (e) {
        return { year: null, month: null, day: null };
      }
    }
    return { year: null, month: null, day: null };
  }
}


/**
 * Set the date parser for format dd-M-yy
 * @export
 * @class StrDateParserFormatter
 * @extends {NgbDateAdapter<string>}
 */
@Injectable()
export class StrDateParserFormatter extends NgbDateAdapter<string> {
  /**
   * Creates an instance of StrDateParserFormatter.
   * @param {CommonUtilService} util
   * @memberof StrDateParserFormatter
   */
  constructor(private util: CommonUtilService) {
    super();
  }

  /** 
   * @param {string} value
   * @returns {NgbDateStruct}
   * @memberof StrDateParserFormatter
   */
  fromModel(value: string): NgbDateStruct {
    if (value) {
      try {
        let dateObj = this.util.parseDate((this.util.userDateFormat || 'dd-M-yy'), value);
        return { year: dateObj.getFullYear(), month: dateObj.getMonth() + 1, day: dateObj.getDate() };
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * @param {NgbDateStruct} date
   * @returns {string}
   * @memberof StrDateParserFormatter
   */
  toModel(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }
    let dateObj = new Date(date.year, date.month - 1, date.day);
    let formatedDate = this.util.formatDate((this.util.userDateFormat || 'dd-M-yy'), dateObj);
    return formatedDate;
  }
}
