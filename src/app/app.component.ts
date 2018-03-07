import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import {UserProfileReducer} from './app-store/reducers/user-profile.reducer';
import {AppLoaderReducer} from './app-store/reducers/app-loader.reducer';
import {DirectoryReducer} from './app-store/reducers/directory.reducer';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  user: Observable<firebase.User>;
  private userProfile;
  private userStoreProfile;

  private showProgressBar = false;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private store: Store<any>) {
    this.user = afAuth.authState;

  }

  ngOnInit() {
    this.store.dispatch({type: AppLoaderReducer.RESET});


    this.user.subscribe(us => {
      if (us) {
        this.userProfile = us;
        console.log(this.userProfile);
        this.store.dispatch({type: UserProfileReducer.SET_PROFILE, payload: us});
      }
    });

    this.store.select<number>('appLoading').subscribe(storeData => {
      this.showProgressBar = (storeData > 0);
    });

    this.store.select<number>('userProfile').subscribe(storeData => {
      this.userStoreProfile = storeData;
    });
  }

}
