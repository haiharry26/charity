import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private httpService: HttpService, 
    private router: Router
  ) { 
    
  }

  ngOnInit(): void {
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.httpService.setLoggedInVal(false);
    this.router.navigate(['login'], { replaceUrl: true });
  }

}
