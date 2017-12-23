import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';


@Injectable()
export class NoteItemService {

  private userProfile;

  constructor(private db: AngularFireDatabase, private store:Store<any>){
    this.store.select<any>("userProfile").subscribe(storeData => {
      if(storeData){
        this.userProfile = storeData;
      }
    });
  }

  public getNoteItem(notePath:string):Observable<any>{


    if(this.userProfile.uid){
      return this.db.object('/users/'+this.userProfile.uid+'/files'+notePath).map(noteItem => {

        if(noteItem.$value){
          if(noteItem.$value && noteItem.$value.length > 3)
            return Object.assign({path:notePath, quickEditMode:(noteItem.$value.substring(0,3)=="$0#"), noteObject:noteItem.$value.substring(3)});
          else
            return Object.assign({path:notePath, quickEditMode:true, noteObject:""});
        }else return {path:notePath, quickEditMode:true, noteObject:""};
      });
    }else return Observable.of("dirty");
  }



  public saveNoteItem(noteObject){
    console.log(noteObject)
    this.db.object('/users/'+this.userProfile.uid+'/files').update({[noteObject.notePath]:("$0#"+noteObject.formattedNotes)})
  }

}
