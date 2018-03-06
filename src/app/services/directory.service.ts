import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {AngularFireDatabase} from 'angularfire2/database';
import { Store } from '@ngrx/store';
import {Observable,Subject} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase/app';


interface Note {
  content:string;
  id?:number;
}

@Injectable()
export class DirectoryService {

  private userProfile;

  notesCollection: AngularFirestoreCollection<Note>;
  notesDoc: AngularFirestoreDocument<Note>;
  notes: Observable<Note[]>;
  note: Observable<Note>;

  constructor(private db: AngularFireDatabase, private afs: AngularFirestore, private store:Store<any>){
    this.store.select<any>("userProfile").subscribe(storeData => {
      if(storeData){




        this.userProfile = storeData;
        // this.notesCollection = this.afs.collection('notes', ref=>{
        //   return ref.orderBy('content');
        //   // return ref.where('hearts', "==", 7);
        // });
        // this.notes = this.notesCollection.valueChanges();
        // console.log(this.notes);
        // this.notes.subscribe(val=>{
        //   console.log(val);
        // });
      }
    });
  }



  public getDirectory():Observable<any>{

    if(this.userProfile.uid){
      // const size$ = new Subject<string>();
      // const queryObservable = size$.switchMap(size =>{
      //
      //   console.log("a");
      //   return this.afs.collection('notes', ref => ref).valueChanges()
      // }
      // );

      // subscribe to changes
      // return queryObservable;
      // .subscribe((queriedItems:any) => {
      //   console.log(queriedItems);
      //   return queriedItems;
      // });
      // size$.next();
      // this.notesDoc = this.afs.doc('notes/asdf');
      // this.note = this.notesDoc.valueChanges();
      // this.notesCollection = this.afs.collection('notes', ref=>{
        // return ref.orderBy('content');
        // return ref.where('hearts', "==", 7);
      // });
      // this.notes = this.notesCollection.valueChanges();
      // console.log(this.notesCollection);

      // var notes = []; HERE
      // var db = firebase.firestore();
      // db.collection('notes');
      // db.collection('notes').onSnapshot(querySnapshot => {
      //   var i = 0;
      //     querySnapshot.forEach((doc) => {
      //         console.log(i, doc.id, " => ", doc.data());
      //         notes[i] = doc.data();
      //         i++;
      //         console.log(notes);
      //     });
      // });
      // return Observable.of(notes);

      // db.collection('notes').get().then(querySnapshot => {
      //     querySnapshot.forEach(doc => {
      //         console.log(doc.id, " => ", doc.data());
      //     });
      // });


      // var addDoc = db.collection('notes').add({
      //     title: 'Test 3',
      //     content: 'more stuff'
      // }).then(ref => {
      //     console.log('Added document with ID: ', ref.id);
      // });


      return Observable.of("dirty");
      // return this.db.object('/users/'+this.userProfile.uid+'/directory').(directory =>{
      //   if(directory.paths)
      //     return JSON.parse(directory.paths);
      //   else return {};
      // });
    }else return Observable.of("dirty");

  }

  public parsePathObservable(querySnapshot){
    // console.log()
    // console.log(querySnapshot);
    var i  = 0;
    var notes = [];
    querySnapshot.forEach((doc) => {
        console.log(i, doc.id, " => ", doc.data());
        notes[i] = doc.data();
        i++;
    });

    console.log(notes);
    return notes;
    // return "asdf";
  }

  public navigatePath(p, page, paths){
    let result = Object.assign(page);
    paths.map(t => result = result[t]);
    if(p && p != "")
      result = result[p];
    return result;
  }

  public createFolder(result:string, page, paths){
    let location = this.navigatePath("", page, paths)
    if(result){
      location[result] = {};
      //this.items = Object.keys(this.navigatePath("", page, paths));
      this.db.object('/users/'+this.userProfile.uid+'/directory').set({paths:JSON.stringify(page)});
    }
  }

  public createNote(result:string, page, paths){
    let location = this.navigatePath("", page, paths)
    if(result){
      location[result] = result;
      this.db.object('/users/'+this.userProfile.uid+'/directory').set({paths:JSON.stringify(page)});
    }

  }


}
