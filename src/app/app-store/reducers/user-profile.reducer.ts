import { ActionReducer, Action } from '@ngrx/store';

export class UserProfileReducer{
  public static SET_PROFILE: string = "[Collection UserProfile] SET_PROFILE";

  public static reducer(userProfile:any, action:Action){
    switch(action.type){
      case "LOGOUT":
        return "dirty";
      case "FETCH_FAILED":
        return action;
      case UserProfileReducer.SET_PROFILE:
        return Object.assign(action.payload);
      default:
        return userProfile;
    };
  }
}
