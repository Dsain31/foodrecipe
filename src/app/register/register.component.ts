import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {MyErrorStateMatcher} from '../service/errorStateMatcher';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userdata;
  alertMsg = '';
  constructor(private router: Router,
    private authService: AuthService,
    private httpService: HttpClientService) { }
  matcher = new MyErrorStateMatcher();
  ngOnInit() {
    //valiadation
    this.userdata = new FormGroup({
      email : new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])),
      newpswd: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,16}/)
      ])),
      confpswd: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,16}/)
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })

    //activate the session for current user
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false);
      this.router.navigate(['home']);
    } else {
      this.authService.afterLogin(true);
      this.router.navigate(['register']);
    }
  }

  ngAfterContentInit(){
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false);
      this.router.navigate(['home']);
    }else {
      this.authService.afterLogin(true);
      this.router.navigate(['register']);
    }
  }

  //get the user typed value
  get email() { return this.userdata.get('email');}
  get newpswd() { return this.userdata.get('newpswd');}
  get confpswd() { return this.userdata.get('confpswd');}
  get name() { return this.userdata.get('name');}

  //show error state
  getEmailError() {
    return this.email.hasError('required') ? 'Email is required!' :
    this.email.hasError('pattern') ? 'invalid email' : '';
  }
  getNameError() {
    return this.name.hasError('required') ? 'Email Is required' : '';
  }
  getNewPswdError() {
    return this.newpswd.hasError('required') ? 'Password is required':
    this.newpswd.hasError('pattern') ? 'Minimum 8 and Maximum 10 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character' : '';
  }
  getConfPswdError() {
    return this.confpswd.hasError('required') ? 'Password is required':
    this.confpswd.hasError('pattern') ? 'Password must be same' : '';
  }

  register() {
    if(this.newpswd.value == this.confpswd.value) {
      this.httpService.register(this.email.value, this.confpswd.value, this.name.value)
        .subscribe((resp: any)=> {
          localStorage.setItem("id", resp);
          this.router.navigate(['home']);
          alert("Succesfully registerd!");
        });
    } else {
      this.alertMsg = 'Password must be same';
    }
  }

}
