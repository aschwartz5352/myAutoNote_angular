import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import { Store } from '@ngrx/store';
// tslint:disable-next-line:import-blacklist
import {Observable, Subject} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase/app';


interface Note {
  content: string;
  id?: number;
}

@Injectable()
export class DirectoryService {

  private userProfile;

  notesCollection: AngularFirestoreCollection<Note>;
  notesDoc: AngularFirestoreDocument<Note>;
  notes: Observable<Note[]>;
  note: Observable<Note>;

  constructor(private db: AngularFireDatabase, private afs: AngularFirestore, private store: Store<any>) {
    this.store.select<any>('userProfile').subscribe(storeData => {
      if (storeData) {
        this.userProfile = storeData;
      }
    });
  }



  public getDirectory(querySnapshot) {
    if (this.userProfile.uid) {
      const notes = {};
        querySnapshot.forEach((doc) => {
          notes[doc.data().name] = {id: doc.id, name: doc.data().name, ref: doc.data().ref};
        });
        return notes;
    } else {
      return Observable.of('dirty');
    }

  }

  public parsePathObservable(querySnapshot) {
    // console.log()
    // console.log(querySnapshot);
    let i  = 0;
    const notes = [];
    querySnapshot.forEach((doc) => {
        console.log(i, doc.id, ' => ', doc.data());
        notes[i] = doc.data();
        i++;
    });

    console.log(notes);
    return notes;
    // return "asdf";
  }

  /* public navigatePath(p, page, paths) {
    let result = Object.assign(page);
    paths.map(t => result = result[t]);
    if (p && p !== '') {
      result = result[p];
    }
    return result;
  } */

  public createFolder(result: string, page, paths) {
    const location = paths.map(v => v['id']).join('/');
    if (result) {
      location[result] = {};
      // this.items = Object.keys(this.navigatePath("", page, paths));
      this.db.object('/users/' + this.userProfile.uid + '/directory').set({paths: JSON.stringify(page)});
    }
  }

  public createNote(result: string, page, paths) {
    const location = paths.map(v => v['id']).join('/');
    if (result) {
      location[result] = result;
      this.db.object('/users/' + this.userProfile.uid + '/directory').set({paths: JSON.stringify(page)});
    }

  }


}
