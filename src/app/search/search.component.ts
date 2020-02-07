import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { HttpClientService } from '../service/http-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  suggestion = [];
  search;
  showSuggest = true;
  clearBtn = false;
  constructor(private authService: AuthService,
    private httpService: HttpClientService,
    private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false);
    } else {
      this.authService.afterLogin(false);
      this.router.navigate(['login']);
    }
  }

  ngAfterContentInit() {
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false);
    } else {
      this.authService.afterLogin(false);
      this.router.navigate(['login']);
    }
  }

  searchRecipe(keyword){
    this.clearBtn = true; //show close btn
    this.showSuggest = true;
    this.httpService.searchRecipe(keyword).subscribe((res: any)=> {
      // convert array to object with for loop
      res.forEach(element => {
        let obj = {
          recipeId: element._id,
          title: element.title,
          category: element.categoryName
        }
        this.suggestion.push(obj);
      });
    })
  }

showRecipe(recipeId){
  this.router.navigate(['recipe', recipeId]); // passing id to next page
}

clearInput(){
  this.showSuggest = false; //hide the suggsetion after click close btn
  this.search = '';
}

}
