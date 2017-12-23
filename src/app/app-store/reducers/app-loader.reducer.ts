import { Action } from '@ngrx/store';

export class AppLoaderReducer{
  public static START_LOADING: string = "[Collection AppLoader] START_LOADING";
  public static STOP_LOADING: string = "[Collection AppLoader] STOP_LOADING";
  public static RESET: string = "[Collection AppLoader] RESET";

  public static reducer(appLoading:number, action:Action){
    switch(action.type){
      case AppLoaderReducer.START_LOADING:
        return appLoading += 1
      case AppLoaderReducer.RESET:
        return 0;
      case AppLoaderReducer.STOP_LOADING:
        return 0;

      default:
        return appLoading;
    };
  }
}
