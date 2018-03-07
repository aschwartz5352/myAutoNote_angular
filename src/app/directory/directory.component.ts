import { Component, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition, query, animateChild} from '@angular/animations';

import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material';
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

  // private directory;
  private userProfile;
  private items;
  private page;
  private paths = [];
  private onPage = true;
  private dialogRef;
  private root = 'directory';

  constructor(private db: AngularFireDatabase, private store: Store<any>, private router: Router,
    public dialog: MatDialog, private directoryService: DirectoryService) { }

  ngOnInit() {
    this.store.select<any>('userProfile').subscribe(storeUser => {
      if (!storeUser || storeUser === 'dirty') {
        this.router.navigate(['login']);
      } else {
        this.userProfile = storeUser;
        console.log('USER UPDATE');
          this.store.select<any>('directory').subscribe(storeDirectory => {

            if (storeUser && storeUser !== 'dirty') {
              if (storeDirectory && storeDirectory !== 'dirty') {
                console.log(storeDirectory);
                // this.directory = storeDirectory;

                if (Object.keys(storeDirectory).length === 1 && Object.keys(storeDirectory)[0] === '$value') {
                  this.page = {};
                } else {
                  // this.page = JSON.parse(this.directory.paths);
                  this.page = storeDirectory;
                  // this.items = Object.keys(this.directoryService.navigatePath('', this.page, this.paths));
                  this.items = Object.keys(storeDirectory);
                  if (this.dialogRef) {
                    this.dialogRef.close();
                  }
                }
                this.store.dispatch({type: AppLoaderReducer.STOP_LOADING});

              } else if (!storeDirectory) {

                const db = firebase.firestore();
                db.collection(this.root).onSnapshot(querySnapshot => {
                  this.store.dispatch({type: DirectoryReducer.SET_DIRECTORY, payload: querySnapshot});
                });
                this.paths.push({id: this.root, name: 'Home'});
              }
            }

          });

      }

    });
  }

  private home() {
    this.items = Object.keys(this.page);
    this.paths = [];
  }

  private dive(item) {
    const db = firebase.firestore();
    item = this.page[item];
    const curPath = this.paths.map(v => v['id']).join('/') + '/' + item['id'];
    if (item['ref']) {
      // Open note.
      this.store.dispatch({type: NoteItemReducer.GET_NOTE, payload: curPath});
    } else {
      db.collection(curPath + '/' + 'directory').onSnapshot(querySnapshot => {
        this.store.dispatch({type: DirectoryReducer.SET_DIRECTORY, payload: querySnapshot});
      });
      this.paths.push({id: item.id + '/' + 'directory', name: item.name});
    }
    // if (this.hasChildren(item)) {
    //   this.items = Object.keys(this.directoryService.navigatePath(item, this.page, this.paths));
    //   this.paths.push(item);
    // } else {
    //   // open note
    //   this.onPage = false;
    //   let nav = '';
    //   this.paths.map(p => nav += '/' + p);
    //   nav += '/' + this.directoryService.navigatePath(item, this.page, this.paths);
    //   this.store.dispatch({type: NoteItemReducer.GET_NOTE, payload: nav});
    //   // this.router.navigate(['work'], {queryParams:{nav}});

    // }
  }

  private climbTo(path, index) {
    if (index < this.paths.length) {
      this.paths.splice(index + 1);
      const db = firebase.firestore();
      const curPath = this.paths.map(v => v['id']).join('/');
      db.collection(curPath).onSnapshot(querySnapshot => {
        this.store.dispatch({type: DirectoryReducer.SET_DIRECTORY, payload: querySnapshot});
      });
    }
  }



  private hasChildren(p) {

    // let result = this.page;
    // this.paths.map(t => result = result[t]);
    // if (p && p !== '') {
    //   result = result[p];
    // }
    // console.log(result);
    // return !result['ref'];
    // return typeof result !== 'string';
    return !this.page[p]['ref'];
  }

  private createNote() {
    // let location = this.directoryService.navigatePath("", this.page, this.paths);

    this.dialogRef = this.dialog.open(DialogComponent);
    this.dialogRef.componentInstance.actionType = 'note';
    this.dialogRef.componentInstance.paths = this.paths;
    this.dialogRef.componentInstance.page = this.page;
    // this.dialogRef.afterClosed().subscribe(result => {
      // if(result){
        // location[result] = result;
        // this.items = Object.keys(this.directoryService.navigatePath("", this.page, this.paths));
        // this.directory.set({paths:JSON.stringify(this.page)});
        // this.store.dispatch({type:AppLoaderReducer.STOP_LOADING});
    //  }
    // });
  }

  private createFolder() {
    // let location = this.directoryService.navigatePath("", this.page, this.paths)

    this.dialogRef = this.dialog.open(DialogComponent);
    this.dialogRef.componentInstance.actionType = 'folder';
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
