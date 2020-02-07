import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyaccountComponent } from './myaccount.component';
import { AngMaterial } from '../angmaterial';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [MyaccountComponent],
  imports: [
    CommonModule,
    AngMaterial,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '', component: MyaccountComponent
      }
    ])
  ]
})
export class MyaccountModule { }
