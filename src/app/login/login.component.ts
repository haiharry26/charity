import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, NgForm, Validators } from '@angular/forms';
import { HttpService } from '../shared/http.service';
import { ApiConstant } from '../shared/api-constant.enum';
import { AppConstant } from '../shared/app-constant.enum';

import { CommonUtilService } from '../shared/common-util.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;
  userId: string = "";
  password: string = "";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private util: CommonUtilService
  ) {
    this.signInForm = formBuilder.group(
      {
        u_Id: ['', Validators.required],
        pass: ['', Validators.required]
      }
    );
  }

  ngOnInit(): void {
  }

  login(signInForm: any) {
    console.log("signInForm controls", signInForm.controls);

    this.userId = signInForm.controls.u_Id.value;
    this.password = signInForm.controls.pass.value;

    const loginObj = {
      emailId: signInForm.controls.u_Id.value,
      password: signInForm.controls.pass.value
    }
    const url = '/emp/loginEmp'
    if (this.userId === 'user1' && this.password === 'password1') {
      this.router.navigate(['/pages', 'master']);
    } else {
      this.util.notification.warn({
        title: 'Login Failed!',
        msg: 'Please enter valid username and password'
      });
    }
    return;
    this.httpService.httpPost(url, loginObj, null).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('userObj', JSON.stringify(res.result));
      sessionStorage.setItem('isLogged', 'true');

      this.httpService.setLoggedInVal(true);
      this.router.navigate(['pages', 'master']);
    }, (err: any) => {
      console.log(err);
      this.httpService.setLoggedInVal(false);
      alert('Wrong Username and Password');
    });



    // if (this.userId == 'admin' && this.password == 'admin@123') {
    //   this.router.navigate(['/dashboard']);
    // } else {
    //   alert('Wrong Username and Password');
    // }

  }

}
