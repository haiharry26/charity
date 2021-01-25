import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinanceReportComponent } from './finance-report.component';

const routes: Routes = [{ path: '', component: FinanceReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceReportRoutingModule { }
