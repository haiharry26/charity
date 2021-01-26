import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
// import { OwlDateTimeModule, OwlMomentDateTimeModule, OWL_DATE_TIME_FORMATS } from '@danielmoncada/angular-datetime-picker';
import { finYear } from "../pages/data/finYear";
import { MaterialModule } from '../material/material.module';

import { AccordionComponent } from './accordion/accordion.component';
import { TableListingComponent } from './table-listing/table-listing.component';
import { CustomCommonDropdownComponent } from './custom-common-dropdown/custom-common-dropdown.component';
import { CustomDateFilterComponent } from './custom-date-filter/custom-date-filter.component';
import { CustomSelectDdComponent } from './custom-select-dd/custom-select-dd.component';
import { FilterWrapperComponent } from './filter-wrapper/filter-wrapper.component';
import { RepeatorElementsComponent } from './repeator-elements/repeator-elements.component';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'DD MMM YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};


@NgModule({
  declarations: [
    AccordionComponent,
    TableListingComponent,
    CustomCommonDropdownComponent,
    CustomDateFilterComponent,
    CustomSelectDdComponent,
    FilterWrapperComponent,
    RepeatorElementsComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SimpleNotificationsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    MaterialModule,
  ],
  exports: [
    AccordionComponent,
    TableListingComponent,
    CustomCommonDropdownComponent,
    CustomDateFilterComponent,
    CustomSelectDdComponent,
    FilterWrapperComponent,
    RepeatorElementsComponent,

  ]
})
export class SharedModule { }
