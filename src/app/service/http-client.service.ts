import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const  headers = new  HttpHeaders().set('Authorization', 'auth');

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  url = "http://localhost:8000/";
  constructor(private http: HttpClient) { }

  register(email,pswd, name): Observable<any> {
    return this.http.post<any>(this.url + 'register', {"email": email, 
    "pswd": pswd,
    'name': name});  // key-value pair
  }

  login(email,pswd): Observable<any> {
    var data = {
      'email': email,
      'pswd': pswd
    }
    var data1 = JSON.stringify(data);
    let params : HttpParams =  new HttpParams().set('data', data1);
    return this.http.get<any>(this.url + 'login',{headers, params});
  }

  getData(_id): Observable<any>{
    let params : HttpParams =  new HttpParams().set('_id', _id);
    return this.http.get<any>(this.url + 'getData', {headers, params});
  }

  uploadRecipe(id, imgName, title, category, ingreds, imgUrl, ext) {
    return this.http.post(this.url + 'uploadRecipe', {
      id: id,
      imgName: imgName,
      title: title,
      category: category,
      ingreds: ingreds,
      imgUrl: imgUrl,
      ext: ext
    })
  }
  myRecipe(id) {
    let params : HttpParams =  new HttpParams().set('id', id);
    return this.http.get(this.url + 'myRecipe', {headers, params});
  }

  getImages(imgname) {
    // console.log(imgname);
    let params : HttpParams =  new HttpParams().set('imgname', imgname);
    return this.http.get(this.url + 'getImages', { headers, params });
  }

  recipe(recipeid) {
    let params : HttpParams =  new HttpParams().set('id', recipeid);
    return this.http.get(this.url + 'recipe', {params});
  }

  updateRecipe(ingrediants, recipeId, name, ext, url, oldImage) {
    return this.http.post(this.url + 'updateRecipe', {
      ingrediants: ingrediants,
      recipeId: recipeId,
      imgname: name,
      imgext: ext,
      imgurl: url,
      oldImage: oldImage
    })
  }

  deleteRecipe(recipeId){
    return this.http.post(this.url + 'deleteRecipe', {recipeId: recipeId});
  }

  recipes(){
    return this.http.get(this.url + 'recipes');
  }

  searchRecipe(keyword){
    let params : HttpParams =  new HttpParams().set('keyword', keyword)
    return this.http.get(this.url + 'searchRecipe', {params});
  }
}
