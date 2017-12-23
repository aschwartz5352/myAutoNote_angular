import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Store } from '@ngrx/store';
import {MdDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  animations:[]

})
export class HeaderComponent implements OnInit {

  private userProfile:any={};

  constructor(private store:Store<any>,public dialog: MdDialog) { }

  ngOnInit() {
    this.store.select<any>("userProfile").subscribe(storeData => {
      this.userProfile = storeData;
    });
  }

  private openDialog() {
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.actionType = "logout";
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
