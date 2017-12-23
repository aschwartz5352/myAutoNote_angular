import { ActionReducer, Action } from '@ngrx/store';

export class NoteItemReducer{
  public static GET_NOTE: string = "[Collection NoteItem] GET_NOTE";
  public static SAVE_NOTE: string = "[Collection NoteItem] SAVE_NOTE";
  public static RESTORE_NOTE: string = "[Collection NoteItem] RESTORE_NOTE";
  public static RESPONSE_GET_NOTE: string = "[Collection NoteItem] RESPONSE_GET_NOTE";

  public static reducer(noteItem:any, action:Action){
    switch(action.type){
      case "LOGOUT":
        return "dirty";
      case "FETCH_FAILED":
        return action;
      case NoteItemReducer.RESPONSE_GET_NOTE:
        //return Object.assign({path:noteItem, noteObject:action.payload});
        return action.payload;
      case NoteItemReducer.SAVE_NOTE:
        return noteItem;
      case NoteItemReducer.RESTORE_NOTE:
      case NoteItemReducer.GET_NOTE:
        return Object.assign(action.payload);
      default:
        return noteItem;
    };
  }
}
