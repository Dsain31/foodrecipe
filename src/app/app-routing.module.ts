import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'home', loadChildren: () => import ('./home/home.module').then( m => m.HomeModule) //lazy loading
  },
  {
    path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  },
  {
    path: 'register', loadChildren: () => import('./register/register.module').then(m=>m.RegisterModule)
  },
  {
    path: 'myaccount', loadChildren: ()=>import('./myaccount/myaccount.module').then(m=>m.MyaccountModule)
  },
  {
    path: 'search', loadChildren: ()=>import('./search/search.module').then(m=>m.SearchModule)
  },
  {
    path: 'recipe/:id', loadChildren: ()=>import('./recipe/recipe.module').then(m=>m.RecipeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
