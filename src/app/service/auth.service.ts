import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private sbj = new Subject();
  msg = this.sbj.asObservable();
  
  //change the states of login and logout button
  afterLogin(a : boolean) {
    this.sbj.next(a);
  }
}
