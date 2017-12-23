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
export class UserProfileEffects{

  @Effect()
  private logout$;

  constructor(private store:Store<number>,private actions$: Actions, private noteItemService:DirectoryService, private router: Router){

    this.logout$ = this.actions$
    .ofType("LOGOUT")
    .map(noteObject => {return <Action>{type:DirectoryReducer.RESPONSE_GET_DIRECTORY}})
    .do(action => {
      this.router.navigate(['']);
    })
    .catch((errorOnObservable:Action) => Observable.of({type:"FETCH_FAILED",payload:errorOnObservable}));




}

}
