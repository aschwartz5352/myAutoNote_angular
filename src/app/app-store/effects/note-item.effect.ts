import {Injectable} from '@angular/core';
import {Store, Action} from '@ngrx/store';
// tslint:disable-next-line:import-blacklist
import {Observable} from 'rxjs';
import { Effect, Actions } from '@ngrx/effects';
import { Router} from '@angular/router';
import { AppLoaderReducer } from '../../app-store/reducers/app-loader.reducer';

import { NoteItemService } from '../../services/note-item.service';
import { NoteItemReducer } from '../reducers/note-item.reducer';


@Injectable()
export class NoteItemEffects {

  @Effect()
  private getNoteItem$: Observable<Action>;

  @Effect()
  private restoreNoteItem$: Observable<Action>;

  @Effect()
  private saveNoteItem$: Observable<Action>;

  constructor(private store: Store<number>, private actions$: Actions, private noteItemService: NoteItemService, private router: Router) {

    this.getNoteItem$ = this.actions$
    .ofType(NoteItemReducer.GET_NOTE)
    .do(action => this.store.dispatch({type: AppLoaderReducer.START_LOADING}))
    .switchMap((action: Action) => this.noteItemService.getNoteItem(action.payload))
    .map(noteObject => <Action>{type: NoteItemReducer.RESPONSE_GET_NOTE, payload: noteObject})
    .do(action => {
      this.store.dispatch({type: AppLoaderReducer.STOP_LOADING});
      this.router.navigate(['work'], {queryParams: {payload: action.payload.path}});
    })
    .catch((errorOnObservable: Action) => Observable.of({type: 'FETCH_FAILED', payload: errorOnObservable}));

    this.restoreNoteItem$ = this.actions$
    .ofType(NoteItemReducer.RESTORE_NOTE)
    .do(action => this.store.dispatch({type: AppLoaderReducer.START_LOADING}))
    .delay(500)
    .switchMap((action: Action) => this.noteItemService.getNoteItem(action.payload))
    .map(noteObject => <Action>{type: NoteItemReducer.RESPONSE_GET_NOTE, payload: noteObject})
    .do(action => {
      this.store.dispatch({type: AppLoaderReducer.STOP_LOADING});
      this.router.navigate(['work'], {queryParams: {payload: action.payload.path}});
    })
    .catch((errorOnObservable: Action) => Observable.of({type: 'FETCH_FAILED', payload: errorOnObservable}));

    this.saveNoteItem$ = this.actions$
    .ofType(NoteItemReducer.SAVE_NOTE)
    .do(action => this.store.dispatch({type: AppLoaderReducer.START_LOADING}))
    .do(action => {
      console.log(action);
      this.noteItemService.saveNoteItem(action.payload);
      this.store.dispatch({type: AppLoaderReducer.STOP_LOADING});
      this.router.navigate(['work'], {queryParams: {payload: action.payload.path}});
    })
    .catch((errorOnObservable: Action) => Observable.of({type: 'FETCH_FAILED', payload: errorOnObservable}));


}

}
