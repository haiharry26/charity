import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { FinanceReportRoutingModule } from './finance-report-routing.module';
import { FinanceReportComponent } from './finance-report.component';
import { AddReportComponent } from './add-report/add-report.component';


@NgModule({
  declarations: [FinanceReportComponent, AddReportComponent],
  imports: [
    CommonModule,
    FinanceReportRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    AddReportComponent
  ]
})
export class FinanceReportModule { }
