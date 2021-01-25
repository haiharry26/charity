import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { AddMasterComponent } from './add-master/add-master.component';


@NgModule({
  declarations: [MasterComponent, AddMasterComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    AddMasterComponent
  ]
})
export class MasterModule { }
