import { Component, OnInit} from '@angular/core';
import {trigger,state,style,animate,transition,query,animateChild} from '@angular/animations';

import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {MdDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {NoteItemReducer} from '../app-store/reducers/note-item.reducer';
import {AppLoaderReducer} from '../app-store/reducers/app-loader.reducer';
import {DirectoryReducer} from '../app-store/reducers/directory.reducer';
import {DirectoryService} from '../services/directory.service';


@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.sass'],
  animations: [
    trigger('item', [
      state('void', style({
        'background-color': '#fee',
      })),
      transition('* => void', animate('125ms ease-in'))
    ]),
    trigger('loadPage', [
      state('void', style({
        opacity: 0,
      })),
      transition('* => *', animate('125ms ease-in'))
    ])
  ]
})
export class DirectoryComponent implements OnInit {

  //private directory;
  private userProfile;
  private items;
  private page;
  private paths = [];
  private onPage:boolean = true;
  private dialogRef;

  constructor(private db: AngularFireDatabase, private store:Store<any>, private router: Router, public dialog: MdDialog, private directoryService:DirectoryService) { }

  ngOnInit() {
    this.store.select<any>("userProfile").subscribe(storeData => {
      if(!storeData || storeData == "dirty"){
        this.router.navigate(['login']);
      }else{
        this.userProfile = storeData;

          this.store.select<any>("directory").subscribe(storeDirectory => {
            if(storeData && storeData != "dirty"){
              if(storeDirectory && storeDirectory != "dirty"){
                //this.directory = storeDirectory;

                if(Object.keys(storeDirectory).length == 1 && Object.keys(storeDirectory)[0]=="$value")
                  this.page = {};
                else{
                  //this.page = JSON.parse(this.directory.paths);
                  this.page = storeDirectory;
                  this.items = Object.keys(this.directoryService.navigatePath("", this.page, this.paths));
                  if(this.dialogRef)
                    this.dialogRef.close();
                }
                this.store.dispatch({type:AppLoaderReducer.STOP_LOADING});

              }else if(!storeDirectory){
                this.store.dispatch({type:DirectoryReducer.GET_DIRECTORY});
              }
            }

          });
        
      }
    });
  }

  private home(){
    this.items = Object.keys(this.page)
    this.paths = [];
  }

  private dive(path){
    if(this.hasChildren(path)){
      this.items = Object.keys(this.directoryService.navigatePath(path, this.page, this.paths));
      this.paths.push(path);
    }else{
      //open note
      this.onPage =false;
      let nav = "";
      this.paths.map(p => nav += "/"+p);
      nav += "/"+this.directoryService.navigatePath(path, this.page, this.paths);
      this.store.dispatch({type:NoteItemReducer.GET_NOTE, payload:nav});
      //this.router.navigate(['work'], {queryParams:{nav}});

    }
  }

  private climbTo(path, index){
    if(index < this.paths.length){
      this.paths.splice(index+1);
      this.items = Object.keys(this.directoryService.navigatePath("", this.page, this.paths));
    }
  }



  private hasChildren(p){
    let result = this.page;
    this.paths.map(t => result = result[t]);
    if(p && p != "")
      result = result[p];

    return typeof result != 'string';
  }

  private createNote(){
    //let location = this.directoryService.navigatePath("", this.page, this.paths);

    this.dialogRef = this.dialog.open(DialogComponent);
    this.dialogRef.componentInstance.actionType = "note";
    this.dialogRef.componentInstance.paths = this.paths;
    this.dialogRef.componentInstance.page = this.page;
    //this.dialogRef.afterClosed().subscribe(result => {
      //if(result){
        //location[result] = result;
        //this.items = Object.keys(this.directoryService.navigatePath("", this.page, this.paths));
        //this.directory.set({paths:JSON.stringify(this.page)});
        //this.store.dispatch({type:AppLoaderReducer.STOP_LOADING});
    //  }
    //});
  }

  private createFolder(){
    //let location = this.directoryService.navigatePath("", this.page, this.paths)

    this.dialogRef = this.dialog.open(DialogComponent);
    this.dialogRef.componentInstance.actionType = "folder";
    this.dialogRef.componentInstance.paths = this.paths;
    this.dialogRef.componentInstance.page = this.page;
    // dialogRef.afterClosed().subscribe(result => {
    //   if(result){
    //     location[result] = {};
    //     this.items = Object.keys(this.directoryService.navigatePath("", this.page, this.paths));
    //     //this.directory.set({paths:JSON.stringify(this.page)});
    //     this.store.dispatch({type:AppLoaderReducer.STOP_LOADING});
    //   }
    // });
  }

}
