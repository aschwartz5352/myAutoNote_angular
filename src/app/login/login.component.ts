import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private store: Store<any>) {
    this.user = afAuth.authState;
  }


  ngOnInit() {
    this.store.select<any>('userProfile').subscribe(storeData => {
      // console.log(storeData);
      if (storeData && storeData !== 'dirty') {
        this.router.navigate(['directory']);
      }
    });

  }

  private login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

}
