import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpClientService } from '../service/http-client.service';
import { identifierModuleUrl, CommentStmt } from '@angular/compiler';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipe = [];
  updatValue = true;
  hideBtn =  true;
  edit = 'Edit';
  showCancel =  false;
  ctr = Math.random();
  imgUrl;
  ext;
  imgName;
  oldImage;
  userid;
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private httpService: HttpClientService) { }

  ngOnInit() {
    sessionStorage.setItem('recipeId', this.route.snapshot.paramMap.get('id'));
    this.httpService.recipe(sessionStorage.getItem("recipeId"))
      .subscribe((resp: any)=> {
        // check the selected recipe is myRecipe or not 
        this.userid = resp.foreign_id
        if(this.userid != localStorage.getItem('id')) {
          this.hideBtn = false; //hide button
        }
        let obj = {
          recipeId: resp._id,
          title: resp.title,
          category: resp.categoryName,
          image: '',
          ingrediants: []
        }
        this.oldImage = resp.imgName;
        for(let i = 0; i<resp.ingrediants.length; i++) {
          obj.ingrediants.push(resp.ingrediants[i]);
        }
        this.httpService.getImages(resp.imgName)
          .subscribe((result: any)=> {
            obj.image = 'data:image/' + 'jpeg;base64,' + result.imageUrl;
            this.recipe.push(obj);
          })
      })
  }

  ngAfterContentInit(){
    if(localStorage.getItem('id')){
      this.authService.afterLogin(false);
    }else {
      this.authService.afterLogin(true);
      this.router.navigate(['login']);
    }

    if(this.userid == localStorage.getItem('id')) {
      this.hideBtn = false;
    }
  }

  editSteps() {
    this.updatValue = !this.updatValue;
    if(this.edit == 'Edit') {
      this.edit = 'Cancel';
    } else {
      this.edit = 'Edit';
    }
  }

  addInput(steps){
    //dynamic add input fileds
    steps.push({
      ingrediants: ''
    })
    this.showCancel = true;
  }

  cancelInput(ingreds){
    ingreds.pop();
  }

  updatRecipe(ingrediants, recipeId) {
    // console.log(this.imgName, this.oldImage);
    this.httpService.updateRecipe(ingrediants, recipeId, this.imgName, 
      this.ext, this.imgUrl, this.oldImage)
      .subscribe((resp: any)=> {
        alert(resp.response);
        this.router.navigate(['home']);
      })
  }

  deleteRecipe(recipeId){
    this.httpService.deleteRecipe(recipeId)
      .subscribe((res: any)=> {
        alert(res.response);
        this.router.navigate(['home']);
      })
  }

  changePhoto(event) {
    let image;
    if(event.target.files[0] && event.target.files){
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        image = reader.result;
        var slashIndex, semicolonIndex, commaIndex;
        // changing into image64
        for(let x = 0; x < image.length; x++) {
          if(image[x] == '/') {
            slashIndex = x;
          }
          if(image[x] == ';') {
            semicolonIndex = x;
          }
          if(image[x] == ',') {
            commaIndex = x;
            break;
          }
        }

        this.imgUrl=image.substring(commaIndex+1); //image64 url
        //console.log(imageUrl);
        this.ext = image.slice(slashIndex+1, semicolonIndex); //image extention
        //console.log(this.ext);
        this.imgName = 'image' + this.ctr; //change custom name to image
        this.ctr++; // control value added with every image to define unique name
      }
      reader.readAsDataURL(file);
    }
  }
}
