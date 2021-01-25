import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { AddTransactionsComponent } from './add-transactions/add-transactions.component';


@NgModule({
  declarations: [TransactionsComponent, AddTransactionsComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    AddTransactionsComponent
  ]
})
export class TransactionsModule { }
