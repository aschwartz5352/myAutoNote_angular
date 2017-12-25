import { Component } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import {UserProfileReducer} from './app-store/reducers/user-profile.reducer';
import {AppLoaderReducer} from './app-store/reducers/app-loader.reducer';

export interface WorkingLine{
  content: string;
  style: string;
}

// export enum HeaderStyle { HEADER1:"header1", HEADER2:"header1", HEADER3:"header1", HEADER4:"header1", NORMAL:"header1"}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  user: Observable<firebase.User>;
  private userProfile;
  private userStoreProfile;

  private showProgressBar:boolean = false;

  constructor(private afAuth: AngularFireAuth,private db: AngularFireDatabase, private store:Store<any>) {
    this.user = afAuth.authState;

  }

  ngOnInit() {
    this.store.dispatch({type:AppLoaderReducer.RESET});


    this.user.subscribe(us => {
      if(us){
        this.userProfile = us;
        this.store.dispatch({type:UserProfileReducer.SET_PROFILE, payload:us});
      }
    });

    this.store.select<number>("appLoading").subscribe(storeData => {
      this.showProgressBar = (storeData > 0);
    });

    this.store.select<number>("userProfile").subscribe(storeData => {
      this.userStoreProfile = storeData;
    });
  }

}
