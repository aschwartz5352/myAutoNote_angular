import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { SanitizeHtmlPipe } from './app-pipes/sanitize.pipe';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './auth/auth.component';
import { WorkScreenComponent } from './work-screen/work-screen.component';

import { WorkScreenService } from './work-screen/work-screen.service';
import { NoteItemService } from './services/note-item.service';
import { DirectoryService } from './services/directory.service';

import { UserProfileReducer } from './app-store/reducers/user-profile.reducer';
import { NoteItemReducer } from './app-store/reducers/note-item.reducer';
import { AppLoaderReducer } from './app-store/reducers/app-loader.reducer';
import { DirectoryReducer } from './app-store/reducers/directory.reducer';

import { NoteItemEffects } from './app-store/effects/note-item.effect';
import { DirectoryEffects } from './app-store/effects/directory.effect';
import { UserProfileEffects } from './app-store/effects/user-profile.effect';


import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {MaterialModule,MdDialogModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { DirectoryComponent } from './directory/directory.component';
import { DialogComponent } from './dialog/dialog.component';
import { LoginComponent } from './login/login.component';
import { FormattedLineComponent } from './formatted-line/formatted-line.component'

export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    WorkScreenComponent,
    DirectoryComponent,
    DialogComponent,
    SanitizeHtmlPipe,
    LoginComponent,
    FormattedLineComponent
  ],
  entryComponents:[DialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    MdDialogModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule,
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    StoreModule.provideStore({
       userProfile: UserProfileReducer.reducer,
       noteItem: NoteItemReducer.reducer,
       appLoading:AppLoaderReducer.reducer,
       directory:DirectoryReducer.reducer
     }),
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    }),
    EffectsModule.run(NoteItemEffects),
    EffectsModule.run(DirectoryEffects),
    EffectsModule.run(UserProfileEffects)
  ],
  providers: [AuthService, WorkScreenService, NoteItemService, DirectoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
