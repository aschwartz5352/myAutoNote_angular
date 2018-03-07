import { ActionReducer, Action } from '@ngrx/store';

export class DirectoryReducer {
  public static CREATE_FOLDER = '[Collection NoteItem] CREATE_FOLDER';
  public static CREATE_NOTE = '[Collection NoteItem] CREATE_NOTE';
  public static SET_DIRECTORY = '[Collection NoteItem] SET_DIRECTORY';
  public static SET_DIRECTORY_RESPONSE = '[Collection NoteItem] SET_DIRECTORY_RESPONSE';
  public static GET_DIRECTORY = '[Collection NoteItem] GET_DIRECTORY';
  public static RESTORE_DIRECTORY = '[Collection NoteItem] RESTORE_DIRECTORY';
  public static RESPONSE_GET_DIRECTORY = '[Collection NoteItem] RESPONSE_GET_DIRECTORY';

  public static reducer(directory: any, action: Action) {
    if (action) {
      switch (action.type) {
        case 'LOGOUT':
          return 'dirty';
        case 'FETCH_FAILED':
          return action.payload;
        case DirectoryReducer.SET_DIRECTORY:
        case DirectoryReducer.SET_DIRECTORY_RESPONSE:
          return action.payload;
        case DirectoryReducer.CREATE_FOLDER:
        case DirectoryReducer.CREATE_NOTE:
        return directory;
        case DirectoryReducer.RESTORE_DIRECTORY:
        default:
          return directory;
      }
    }
  }
}
