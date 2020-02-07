import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { AngMaterial } from '../angmaterial';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AngMaterial,
    RouterModule.forChild([
      {
        path: '', component: HomeComponent
      }
    ])
  ]
})
export class HomeModule { }
