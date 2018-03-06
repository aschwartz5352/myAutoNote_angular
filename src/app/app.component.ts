import { Component } from '@angular/core';
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
        var db = firebase.firestore();
        db.collection('notes').onSnapshot(querySnapshot => {
          this.store.dispatch({type:DirectoryReducer.SET_DIRECTORY, payload:querySnapshot});
        });
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
