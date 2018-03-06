import {Injectable} from '@angular/core';
import {Store, Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import { Effect, Actions } from '@ngrx/effects';
import { Router} from '@angular/router';

import { DialogComponent } from '../../dialog/dialog.component';
import { DirectoryService } from '../../services/directory.service';
import { DirectoryReducer } from '../reducers/directory.reducer';
import { AppLoaderReducer } from '../../app-store/reducers/app-loader.reducer';


@Injectable()
export class DirectoryEffects{

  // @Effect()
  // private getDirectory$:Observable<Action>;

  @Effect()
  private createFolder$;

  @Effect()
  private createNote$;

  @Effect()
  private setDirectory$;

  constructor(private store:Store<number>,private actions$: Actions, private directoryService:DirectoryService, private router: Router){

    // this.getDirectory$ = this.actions$
    // .ofType(DirectoryReducer.GET_DIRECTORY)
    // .do(action => this.store.dispatch({type:AppLoaderReducer.START_LOADING}))
    // .switchMap((action:Action) => this.directoryService.getDirectory())
    // .map(noteObject => <Action>{type:DirectoryReducer.RESPONSE_GET_DIRECTORY,payload:noteObject})
    // .do(action => {
    //   this.store.dispatch({type:AppLoaderReducer.STOP_LOADING});
    //   //this.router.navigate(['work'], {queryParams:{payload:action.payload.path}});
    // })
    // .catch((errorOnObservable:Action) => Observable.of({type:"FETCH_FAILED",payload:errorOnObservable}));

    this.setDirectory$ = this.actions$
    .ofType(DirectoryReducer.SET_DIRECTORY)
    .map((action:Action) => this.directoryService.parsePathObservable(action.payload))
    .map(directory => {return <Action>{type:DirectoryReducer.SET_DIRECTORY_RESPONSE,payload:directory}})
    .do(action => {
      console.log("Rounting");
      // this.router.navigate(['directory'], {});
    })
    .catch((errorOnObservable:Action) => Observable.of({type:"FETCH_FAILED",payload:errorOnObservable}));

    this.createFolder$ = this.actions$
    .ofType(DirectoryReducer.CREATE_FOLDER)
    .map((action:Action) => this.directoryService.createFolder(action.payload.name,action.payload.page,action.payload.paths))
    .map(noteObject => {return <Action>{type:DirectoryReducer.GET_DIRECTORY}})
    .do(action => {
    })
    .catch((errorOnObservable:Action) => Observable.of({type:"FETCH_FAILED",payload:errorOnObservable}));

    this.createNote$ = this.actions$
    .ofType(DirectoryReducer.CREATE_NOTE)
    .map((action:Action) => this.directoryService.createNote(action.payload.name,action.payload.page,action.payload.paths))
    .map(noteObject => {return <Action>{type:DirectoryReducer.GET_DIRECTORY}})
    .do(action => {
    })
    .catch((errorOnObservable:Action) => Observable.of({type:"FETCH_FAILED",payload:errorOnObservable}));





}

}
