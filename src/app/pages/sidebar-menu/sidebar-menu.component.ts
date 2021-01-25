import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  isCollapsed: boolean = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onMenuClick() {
    this.isCollapsed = !this.isCollapsed;
  }

}
