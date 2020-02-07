import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
recipes = [];
  constructor(private authService: AuthService,
    private router: Router,
    private httpService: HttpClientService) { }
  
  ngOnInit() {
    this.httpService.recipes()
      .subscribe((res: any)=> {
        for(let i = 0; i<res.obj.length; i++) {
          // console.log(res.obj[i]);
          this.httpService.getImages(res.obj[i].imgName)
              .subscribe((result: any)=> {
                let obj = {
                  recipeId: res.obj[i]._id,
                  title: res.obj[i].title,
                  category: res.obj[i].categoryName,
                  image: 'data:image/' + 'jpeg;base64,' + result.imageUrl,
                  ingrediants: res.obj[i].ingrediants
                }
                this.recipes.push(obj);
              })
        }
      })
  }

  ngAfterContentInit(){
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false); //change login button state
    }else {
      this.authService.afterLogin(true);
      this.router.navigate(['login']);
    }
  }

  showRecipe(recipeId) {
    this.router.navigate(['recipe', recipeId]); //passing recipe id to recipe page
  }

}
