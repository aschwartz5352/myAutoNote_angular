import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {WorkingLine} from '../app.component';

@Component({
  selector: 'formatted-line',
  templateUrl: './formatted-line.component.html',
  styleUrls: ['./formatted-line.component.sass']
})
export class FormattedLineComponent implements OnInit {

  @Input()
  workingLineData:WorkingLine;

  @Input()
  index : string;

  @Input()
  selected : string;

  @Output()
  onClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    // console.log(this.workingLineData.content);
  }

  private onLineClick(){
    this.onClick.emit(this.index);
  }
}
