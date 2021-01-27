import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsComponent } from './report.component';

const routes: Routes = [{ path: '', component: TransactionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
