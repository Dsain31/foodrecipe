import { Component, OnInit } from '@angular/core';
import {MyErrorStateMatcher} from '../service/errorStateMatcher';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpClientService } from '../service/http-client.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userdata;
  constructor( private router: Router,
    private authService: AuthService,
    private httpService: HttpClientService) { }

  matcher = new MyErrorStateMatcher(); //refrence of stateMatcher service for changing state in forms for validation

  ngOnInit() {
    //validation
    this.userdata = new FormGroup({
      email : new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])),
      pswd: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,16}/)
      ]))
    })
    if(localStorage.getItem('id')) {
      this.authService.afterLogin(false); //change login button state
      this.router.navigate(['home'])
    } else {
      this.authService.afterLogin(true);
      this.router.navigate(['login']);
    }
  }

  ngAfterContentInit() {
    if(localStorage.getItem('id')) {
      this.authService.afterLogin(false);
      this.router.navigate(['home']);
    }else {
      this.authService.afterLogin(true);
      this.router.navigate(['login']);
    }
  }

  get email() { return this.userdata.get('email');} //get value from input user
  get pswd() { return this.userdata.get('pswd');}

  getEmailError() {
    return this.email.hasError('required') ? 'Email is required!' :
    this.email.hasError('pattern') ? 'invalid email' : '';
  }

  getPswdError() {
    return this.pswd.hasError('required') ? 'Password is required':
    this.pswd.hasError('pattern') ? 'Minimum 8 and Maximum 10 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character' : '';
  }

  login() {
    // console.log(this.email.value);
    this.httpService.login(this.email.value, this.pswd.value)
      .subscribe((resp: any)=> {
        console.log(resp);
        this.router.navigate(['home']);
        this.authService.afterLogin(false);
        localStorage.setItem("id", resp); //to manage the session store userid in localstorage
      },(err: any)=> {
        // console.log(err.error.error);
        alert(err.error.error)
      })
  }

}
