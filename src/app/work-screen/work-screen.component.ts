import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {trigger,state,style,animate,transition,query,animateChild} from '@angular/animations';
// import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import {Subject, Observable} from 'rxjs';
import { WorkScreenService } from './work-screen.service';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {NoteItemReducer} from '../app-store/reducers/note-item.reducer';
import {MdDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {MdSnackBar} from '@angular/material';
import {WorkingLine} from '../app.component';

@Component({
  selector: 'app-work-screen',
  templateUrl: './work-screen.component.html',
  styleUrls: ['./work-screen.component.sass'],
  animations: [
    trigger('ngIfAnimation', [
    transition(':enter, :leave', [
      query('@*', animateChild())
    ])
  ]),
  trigger('loadPage', [
    state('void', style({
      opacity: 0,
    })),
    transition('* => void', animate('125ms ease-in')),
    transition('void => *', animate('125ms ease-in'))
  ]),
  trigger('advancedEditorFunction', [
    state('advanced', style({
      opacity: 1,
      'pointer-events':'auto'
    })),
    transition('* => *', animate('125ms ease-in'))
  ]),
  trigger('saveNotification', [
    state('dirty', style({
      opacity: 0,
    })),
    transition('* => *', animate('125ms ease-in-out'))
  ]),
  trigger('advancedEditorViewer', [
    state('advanced', style({
      opacity: 0
    })),
    transition('* => *', animate('125ms ease-in'))
  ]),
  trigger('workScreen', [
    state('advanced', style({
      'width': '70%',
      'margin': '35px 0 0 17.5%'
    })),
    transition('* => *', animate('125ms ease-in'))
  ])


  ]
})
export class WorkScreenComponent implements OnInit {

  public dirty = false;
  private notePath;
  private noteTitle = "";

  @ViewChild('editorbox') editorbox;
  @ViewChild('editorboxWrapper') editorboxWrapper : ElementRef;
  @ViewChild('viewer') viewer : ElementRef;

  // @ViewChild('editorbox') editorbox;
  private currentLineFormControl:FormControl = new FormControl("hello world!");
  private editorBoxCoords = {top:0, right:300};
  private workingLineIdx:number = 0;
  private workingLineArry:WorkingLine[] = [
    {content:"line 1", style:"header1"},
    {content:"line 2", style:"header2"},
    {content:"line 3", style:"header3"},
    {content:"line 4", style:"header4"},
    {content:"line 5", style:"normal"},
    {content:"", style:"normal"}
  ];
  // private workingLineArry:WorkingLine[] = [
  //   {content:"line 1", style:HeaderStyle.HEADER1},
  //   {content:"line 2", style:HeaderStyle.HEADER2},
  //   {content:"line 3", style:HeaderStyle.HEADER3},
  //   {content:"line 4", style:HeaderStyle.HEADER4},
  //   {content:"line 5", style:HeaderStyle.NORMAL},
  //   {content:"", style:HeaderStyle.NORMAL}
  // ];
  // private working
  // @ViewChild('editor') editor: QuillEditorComponent;

  private userProfile;
  private dbNote;


  private formattedNotes:string = "";

  private contentForm:FormControl = new FormControl("");

  private value:string;

  // public keyUp = new Subject<string>();

  constructor(private workScreenService:WorkScreenService, private db: AngularFireDatabase, private store:Store<any>, private route:ActivatedRoute,
    private router: Router,public dialog: MdDialog, public snackBar: MdSnackBar) {
    // const observable = this.keyUp
    // .map(value => event.target['innerHTML'])
    // .debounceTime(250)
    // .distinctUntilChanged()
    //   .flatMap((search) => {
    //     return Observable.of(search)//.delay(500);
    //   })
    // .subscribe((data) => {
    //   this.updateContents(data);
    // });
  }

  ngOnInit() {
    this.store.select<any>("userProfile").subscribe(storeUser => {
      this.userProfile = storeUser;

      this.store.select<any>("noteItem").subscribe(storeData => {
        if(storeData){
          this.notePath = storeData.path;

          this.dbNote = storeData;

          if(this.dbNote){
            // this.value = this.dbNote.noteObject;
            // this.updateContents(this.value);
          }else
            this.value = "";
            // console.log(this.workingLineArry);
            this.currentLineFormControl.valueChanges.debounceTime(100).distinctUntilChanged().subscribe(val => {this.updateContents(val)});
            // this.currentLineFormControl.getSelection();


        }else{
            if(storeUser){

              this.route.queryParams.subscribe(params => {
                 if(params){
                   this.store.dispatch({type:NoteItemReducer.RESTORE_NOTE, payload:params.payload});
                 }
              });
            }


        }
      });
    });

  }

  onCaret(cord: any) {
    console.log(cord);
      // let e = document.getSelection().anchorNode.parentElement;
      // let e1 = document.elementFromPoint(cord.event.pageX, cord.event.pageX);
      // console.log(e, e1);

  }



  private setupViewer(event){
    console.log(event)
  }

  private save(){
    console.log(this.formattedNotes);

    //this.store.dispatch({type:NoteItemReducer.SAVE_NOTE,payload:{path:this.notePath,quickEditMode:(this.viewMode=="quick"),noteObject:this.value}});

    //this.value = "<h1 style='color:#f00' class='textclass' id='testid'>" +this.value + "</h1>";

    this.db.object('/users/'+this.userProfile.uid+'/files').update({[this.notePath]:("$0#"+this.value)})

    this.dirty = false;
    //this.dbNote.set({text:this.value});
  }

  private switchToAdvanced(){
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.actionType = "moveToAdvanced";
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.db.object('/users/'+this.userProfile.uid+'/files').update({[this.notePath]:("$1#"+this.formattedNotes)})
        this.snackBar.open("closed quick editor", "undo", {
          duration: 5000,
        }).onAction().subscribe(() => {
          this.db.object('/users/'+this.userProfile.uid+'/files').update({[this.notePath]:("$0#"+this.value)})
        });

      }
    });
  }

  private lineClicked(index){
    // console.log(index);
      // let lastIndex = e.selectionStart;
      this.workingLineIdx = index;
      this.editorBoxCoords.top = this.viewer.nativeElement.children[this.workingLineIdx].offsetTop-20;
      this.currentLineFormControl.setValue(this.workingLineArry[this.workingLineIdx].content);
      this.editorbox.nativeElement.focus();
      // e.selectionEnd = lastIndex;


  }

  private keyCliked(event,e){
    // console.log(event);
    // console.log(e.selectionStart);
    let lastIndex = e.selectionStart;
    if(event){
      switch(event.key){
        case "ArrowUp":
          if(this.workingLineIdx > 0){
            this.workingLineIdx--;
            this.editorBoxCoords.top = this.viewer.nativeElement.children[this.workingLineIdx].offsetTop-20;
            // console.log(this.viewer);
            // this.editorBoxCoords.right = this.viewer.nativeElement.children[this.workingLineIdx].children[0].clientWidth;
            this.currentLineFormControl.setValue(this.workingLineArry[this.workingLineIdx].content);
            e.selectionEnd = lastIndex;
            return false;
          }
          break;
        case "ArrowDown":
          if(this.workingLineIdx < this.workingLineArry.length-1){
            this.workingLineIdx++;
            this.editorBoxCoords.top = this.viewer.nativeElement.children[this.workingLineIdx].offsetTop-20;
            this.currentLineFormControl.setValue(this.workingLineArry[this.workingLineIdx].content);
            e.selectionEnd = lastIndex;
            return false;

          }
          break;
        case "ArrowLeft":

          break;
        case "ArrowRight":

          break;
      }

    }
  }

  private updateContent(event:any, input:string){
    let temp = "";
    let formattedLines = this.formattedNotes.split("\n");
    let lines = 0;
    let newLine;
    this.dirty = true;
    //console.log(Array.from(event.editor.container.children[0].children));
    let unprocessed =[];
    if(event)
      unprocessed = Array.from(event.editor.container.children[0].children);
    else if(input)
      unprocessed = Array.from(input.split("\n"));


    this.workScreenService.paddingLevel = [];
    unprocessed.map((lineElement:HTMLElement,i:number) => {
       console.log(lineElement);
         temp += this.workScreenService.parseText(lineElement, (i<unprocessed.length-1)?unprocessed[i+1]:"", 0)+"\n";


     });


       this.formattedNotes = temp;

  }


  private hasChildren(p){

  }

  private updateContents(newContent:string){
    console.log(newContent);

    this.workingLineArry[this.workingLineIdx] = this.workScreenService.parseText(newContent, "", 0);

  }



  private back(){
    this.router.navigate(['directory']);

  }

  private selection;
  private currentValue:string = "";
  private something(event){

    if (window.getSelection) {
      let a = window.getSelection().focusOffset;
      let b = window.getSelection().anchorOffset;
      if(a < b)
        this.selection = {start:a,end:b};
      else
        this.selection = {start:b,end:a};
        //console.log(this.selection,  window.getSelection().getRangeAt(0));
    }
  }

  private format(command:string, event){
    // switch(type){
    //   case "b":
    //   case "em":
    //   case "u":
    // }
    event.preventDefault();
    if (command == 'h1' || command == 'h2' || command == 'p') {
    document.execCommand('formatBlock', false, command);
  }

  if (command == 'forecolor' || command == 'backcolor') {
    document.execCommand(command, false, "#f00");
  }

  // if (command == 'createlink' || command == 'insertimage') {
  //   url = prompt('Enter the link here: ','http:\/\/');
  //   document.execCommand(command, false, url);
  // }

  else {
    console.log(command, document.execCommand(command, false, {id:"hello"}));
    //console.log(window.getSelection().focusNode.extendOffset)// = "oder2";
  }
    // if(this.selection){
    //   console.log(this.selection, this.editorBox.nativeElement.innerHTML);
    //   this.currentValue = this.currentValue.substring(0, this.selection.start) + "<" + type + ">" + this.currentValue.substring(this.selection.start, this.selection.end) + "</" + type + ">" + this.currentValue.substring(this.selection.end);
    // }

  }

  showSelectedText(oField) {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    console.log(text);
    //this.selectedText = text;
  }



}
