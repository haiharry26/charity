import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';

const routes: Routes = [
  { 
    path: '', 
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'master', pathMatch: 'full' },
      { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule) },
      { path: 'transactions', loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule) }, 
      { path: 'finance-report', loadChildren: () => import('./finance-report/finance-report.module').then(m => m.FinanceReportModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
