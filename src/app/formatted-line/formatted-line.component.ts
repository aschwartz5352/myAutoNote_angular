import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// tslint:disable-next-line:import-blacklist
import {Subject, Observable} from 'rxjs';
import { FormControl } from '@angular/forms';


// import {WorkingLine} from '../app.component';
// import {WorkingLine} from '../../typings.d';

@Component({
  selector: 'formatted-line',
  templateUrl: './formatted-line.component.html',
  styleUrls: ['./formatted-line.component.sass']
})
export class FormattedLineComponent implements OnInit {

  @Input()
  workingLineData: WorkingLine;

  @Input()
  index: string;

  @Input()
  selected: string;

  @Output()
  onClick = new EventEmitter<any>();

  @Output()
  onType = new EventEmitter<any>();

  // private currentLineFormControl:FormControl = new FormControl("");


  constructor() {

   }

  ngOnInit() {
    if (this.workingLineData.content.length === 0) {
      console.log('empty');
    }
    // this.currentLineFormControl.setValue(this.workingLineData.content);
    // this.currentLineFormControl.valueChanges.debounceTime(100).distinctUntilChanged().subscribe(val => {
    //   console.log(val);
    //   this.onType.emit(val);
    // });

  }

  private onLineClick() {
    // Emits back to the working screen to set the workingLineIdx to this line
    this.onClick.emit(this.index);
  }

}
