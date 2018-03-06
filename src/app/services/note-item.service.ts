import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {AngularFireDatabase} from 'angularfire2/database';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/map';

interface Note {
  content:string;
  hearts:number;
  id?:number;
}


@Injectable()
export class NoteItemService {

  private userProfile;

  notesCollection: AngularFirestoreCollection<Note>;
  notesDoc: AngularFirestoreDocument<Note>;
  notes: Observable<Note[]>;
  note: Observable<Note>;


  constructor(private db: AngularFireDatabase, private afs: AngularFirestore, private store:Store<any>){
    this.store.select<any>("userProfile").subscribe(storeData => {
      if(storeData){
        this.userProfile = storeData;
      }
    });
  }

  public getNoteItem(notePath:string):Observable<any>{


    if(this.userProfile.uid){
      this.notesDoc = this.afs.doc('notes/asdf');
      this.note = this.notesDoc.valueChanges();
      this.notesCollection = this.afs.collection('notes', ref=>{
        return ref.orderBy('content');
        // return ref.where('hearts', "==", 7);
      });
      this.notes = this.notesCollection.valueChanges();
      this.notes.subscribe(val=>{
        console.log(val);
      });
      return this.notes;

      // return this.db.object('/users/'+this.userProfile.uid+'/files'+notePath).map(noteItem => {
      //
      //   if(noteItem.$value){
      //     if(noteItem.$value && noteItem.$value.length > 3)
      //       return Object.assign({path:notePath, quickEditMode:(noteItem.$value.substring(0,3)=="$0#"), noteObject:noteItem.$value.substring(3)});
      //     else
      //       return Object.assign({path:notePath, quickEditMode:true, noteObject:""});
      //   }else return {path:notePath, quickEditMode:true, noteObject:""};
      // });
    }else return Observable.of("dirty");
  }



  public saveNoteItem(noteObject){
    console.log(noteObject)
    this.db.object('/users/'+this.userProfile.uid+'/files').update({[noteObject.notePath]:("$0#"+noteObject.formattedNotes)})
  }

}
