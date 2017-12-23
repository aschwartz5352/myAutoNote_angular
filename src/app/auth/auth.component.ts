import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import {UserProfileReducer} from '../app-store/reducers/user-profile.reducer';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {

  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  private item;
  forms:any[] = [];

  constructor(private afAuth: AngularFireAuth,private db: AngularFireDatabase, private store:Store<any>) {
    this.user = afAuth.authState;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  ngOnInit() {

    //this.user.subscribe(us => {

      //this.store.dispatch({type:UserProfileReducer.SET_PROFILE, payload:us});
      // let d = new Date();
      //
      //  this.item = this.db.object('/users/'+us.uid);
      //  this.item.update({
      //    lastLoginDate:d.getTime(),
      //  });

      //this.item.subscribe(item => console.log(item));
      //this.items = this.db.list('/items');
    //   this.items.subscribe(items =>{
    //     this.forms = [];
    //     items.map(item => {
    //       console.log(item);
    //       this.forms.push(new FormControl(item.$value));
    //
    //     });
    //     this.forms.map(form => form.valueChanges.subscribe(newData => {
    //       console.log(newData);
    //     }));
    // });
  //});


}

}
