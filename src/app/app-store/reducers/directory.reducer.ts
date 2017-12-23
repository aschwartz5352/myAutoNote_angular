import { ActionReducer, Action } from '@ngrx/store';

export class DirectoryReducer{
  public static CREATE_FOLDER: string = "[Collection NoteItem] CREATE_FOLDER";
  public static CREATE_NOTE: string = "[Collection NoteItem] CREATE_NOTE";
  public static GET_DIRECTORY: string = "[Collection NoteItem] GET_DIRECTORY";
  public static RESTORE_DIRECTORY: string = "[Collection NoteItem] RESTORE_DIRECTORY";
  public static RESPONSE_GET_DIRECTORY: string = "[Collection NoteItem] RESPONSE_GET_DIRECTORY";

  public static reducer(directory:any, action:Action){
    if(action)
    switch(action.type){
      case "LOGOUT":
        return "dirty";
      case "FETCH_FAILED":
        return action.payload;
      case DirectoryReducer.CREATE_FOLDER:
      case DirectoryReducer.CREATE_NOTE:
      return directory;
      case DirectoryReducer.RESPONSE_GET_DIRECTORY:
        //return Object.assign({path:directory, noteObject:action.payload});
        return action.payload;
      case DirectoryReducer.RESTORE_DIRECTORY:
      case DirectoryReducer.GET_DIRECTORY:
        //return Object.assign(action.payload);
      default:
        return directory;
    };
  }
}
