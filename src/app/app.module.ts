import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngMaterial } from './angmaterial';
import { AuthService } from './service/auth.service';
import { HttpClientService } from './service/http-client.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngMaterial,
    HttpClientModule
  ],
  providers: [AuthService, HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
