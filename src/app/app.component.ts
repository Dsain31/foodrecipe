import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { HttpClientService } from './service/http-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'foodRecipe';
  username = '';
  afterLogin: boolean = true;
  constructor(private authService: AuthService,
    private router: Router,
    private httpService: HttpClientService) {}

  ngOnInit() {
    this.authService.msg.subscribe((res: any)=> {
      // console.log(res);
      this.afterLogin = res;
    })

    if(localStorage.getItem('id')) {
      this.authService.msg.subscribe((res: any)=> {
        // console.log(res);
        this.afterLogin = res;
        // this.router.navigate(['home']);
      })
    } else {
      // this.router.navigate(['login']);
      this.authService.afterLogin(true);
    }

    this.httpService.getData(localStorage.getItem("id"))
      .subscribe((res:any)=> {
        // console.log(res.email);
        this.username = res.name;
      })
  }

  ngAfterContentInit() {
    this.authService.msg.subscribe((res: any)=> {
      this.afterLogin = res;
    })

    if(localStorage.getItem('id')) {
      this.authService.msg.subscribe((res: any)=> {
        this.afterLogin = res;
      })
    } else {
      this.authService.afterLogin(true);
    }
    this.httpService.getData(localStorage.getItem("id"))
      .subscribe((res:any)=> {
        this.username = res.name; //get username
      })
  }

  logout(){
    localStorage.removeItem('id');
    sessionStorage.removeItem('recipeId');
    this.authService.afterLogin(true);
    this.router.navigate(['login']);
  }
}
