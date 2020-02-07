import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeComponent } from './recipe.component';
import { AngMaterial } from '../angmaterial';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [RecipeComponent],
  imports: [
    CommonModule,
    AngMaterial,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '', component: RecipeComponent
      }
    ])
  ]
})
export class RecipeModule { }
