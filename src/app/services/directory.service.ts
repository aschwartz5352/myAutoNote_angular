import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';


@Injectable()
export class DirectoryService {

  private userProfile;

  constructor(private db: AngularFireDatabase, private store:Store<any>){
    this.store.select<any>("userProfile").subscribe(storeData => {
      if(storeData){
        this.userProfile = storeData;
      }
    });
  }

  public getDirectory():Observable<any>{

    if(this.userProfile.uid){
      return this.db.object('/users/'+this.userProfile.uid+'/directory').map(directory =>{
        if(directory.paths)
          return JSON.parse(directory.paths);
        else return {};
      });
    }else return Observable.of("dirty");

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
