import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';

import { TransactionsRoutingModule } from './report-routing.module';
import { TransactionsComponent } from './report.component';



@NgModule({
  declarations: [TransactionsComponent, ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
  ]
})
export class ReportModule { }
