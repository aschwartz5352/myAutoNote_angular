import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import {UserProfileReducer} from '../app-store/reducers/user-profile.reducer';
import {DirectoryReducer} from '../app-store/reducers/directory.reducer';
import {DirectoryService} from '../services/directory.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class DialogComponent implements OnInit, OnChanges {

  public actionType: string;

  private userProfile: any= {};

  private name= '';

  public page: any;

  public paths: any;

  private loading = false;


  constructor(private store: Store<any>, public dialogRef: MatDialogRef<DialogComponent>, private afAuth: AngularFireAuth,
    private directoryService: DirectoryService) { }

  ngOnInit() {
    this.store.select<any>('userProfile').subscribe(storeData => {
      this.userProfile = storeData;
      this.loading = false;

    });
  }

  ngOnChanges() {
  }

  private createNote(result) {
    // if(name){
    //   location[name] = {};
    //   let items = Object.keys(this.navigatePath(""));
    //   this.directory.set({paths:JSON.stringify(this.page)});
    //   this.store.dispatch({type:AppLoaderReducer.STOP_LOADING});
    //   this.dialogRef.close({name:name});
    //
    // }
    if (result) {
      this.loading = true;
      this.store.dispatch({type: DirectoryReducer.CREATE_NOTE, payload: {name: result, page: this.page, paths: this.paths}});
    }
  }

  private createFolder(result) {
    // let location = this.directoryService.navigatePath("", this.page, this.paths)

    if (result) {
      this.loading = true;
      this.store.dispatch({type: DirectoryReducer.CREATE_FOLDER, payload: {name: result, page: this.page, paths: this.paths}});
    }
  }

  logout() {
    this.afAuth.auth.signOut();
    this.store.dispatch({type: 'LOGOUT'});
  }

  private switchToAdvancedEditor() {
    this.dialogRef.close(true);
  }



}
