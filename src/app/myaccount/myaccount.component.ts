import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { HttpClientService } from '../service/http-client.service';
import { element } from 'protractor';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
photo;
ctr = Math.random();
imgUrl;
ext;
imgName;
showCancel = false;
title;
category;
myRecipe = [];
ingreds = [{
  ingrediants : ''
}]
  constructor(private authService: AuthService,
    private router: Router,
    private httpService: HttpClientService) { }

  ngOnInit() {
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false); //change login button state
    } else {
      this.authService.afterLogin(true);
      this.router.navigate(['login']);
    }
      this.httpService.myRecipe(localStorage.getItem('id'))
        .subscribe((res: any)=> {
          // console.log(res);
          for(let i = 0; i<res.length; i++) {
            this.httpService.getImages(res[i].imgName)
              .subscribe((result: any)=> {
                let obj = {
                  recipeId: res[i]._id,
                  title: res[i].title,
                  category: res[i].categoryName,
                  image: 'data:image/' + 'jpeg;base64,' + result.imageUrl,
                  ingrediants: res[i].ingrediants
                }
                this.myRecipe.push(obj);
              })
          }
        })
  }
  ngAfterContentInit(){
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false);
    }else {
      this.authService.afterLogin(true);
      this.router.navigate(['login']);
    }
  }

  addPhoto(event) {
    // console.log(event.target.files);
    if(event.target.files[0] && event.target.files){
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        this.photo = reader.result;
        // console.log(this.photo);
        var slashIndex, semicolonIndex, commaIndex;
        for(let x = 0; x < this.photo.length; x++) {
          if(this.photo[x] == '/') {
            slashIndex = x;
           // console.log(this.slashIndex)
          }
          if(this.photo[x] == ';') {
            semicolonIndex = x;
           // console.log(this.semicolonIndex);
          }
          if(this.photo[x] == ',') {
            commaIndex = x;
           // console.log(this.commaIndex);
            break;
          }
        }

        this.imgUrl=this.photo.substring(commaIndex+1);
        //console.log(this.imageUrl);
        this.ext = this.photo.slice(slashIndex+1, semicolonIndex);
        //console.log(this.ext);
        this.imgName = 'image' + this.ctr;
        this.ctr++;
      }
      reader.readAsDataURL(file);
    }
  }

  uploadRecipe() {
      if(this.photo == undefined && this.title == undefined && this.category == undefined ) {
        alert("Please add recipe");
      } else {
        this.httpService.uploadRecipe(localStorage.getItem('id'),
         this.imgName, this.title, this.category, this.ingreds, this.imgUrl, this.ext)
           .subscribe((resp: any)=> {
            //  console.log(resp);
            this.router.navigate(['home']);
            alert('your recipe uploaded!');
           })
      }
  }

  cancelInput(){
    this.ingreds.pop();
  }
  addInput(){
    //dyanmic input fields
    this.ingreds.push({
      ingrediants: ''
    })
    this.showCancel = true;
  }

  showRecipe(recipeId) {
    // console.log(recipeId);
    this.router.navigate(['recipe', recipeId]);
  }
}