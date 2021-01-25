import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

@NgModule({
  declarations: [PagesComponent, HeaderComponent, FooterComponent, SidebarMenuComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarMenuComponent
  ]
})
export class PagesModule { }
