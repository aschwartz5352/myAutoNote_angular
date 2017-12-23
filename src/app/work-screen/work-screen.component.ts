import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

  @ViewChild('editorBox') editorBox;
  // @ViewChild('editor') editor: QuillEditorComponent;

  private userProfile;
  private dbNote;

  private viewMode = "quick";
  private formattedNotes:string = "";

  private contentForm:FormControl = new FormControl("");

  private value:string;

  public keyUp = new Subject<string>();

  private viewModes:string[] = ["dual", "left", "right"]

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
          this.viewMode = (storeData.quickEditMode) ? "quick" : "advanced";
          if(this.dbNote){
            this.value = this.dbNote.noteObject;
          }else
            this.value = "";

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

  private switchViewMode(newMode:string){
    this.viewMode = newMode;
  }

  private setupViewer(event){
    console.log(event)
    event.container.inner
  }

  private save(){
    console.log(this.formattedNotes);

    //this.store.dispatch({type:NoteItemReducer.SAVE_NOTE,payload:{path:this.notePath,quickEditMode:(this.viewMode=="quick"),noteObject:this.value}});

    //this.value = "<h1 style='color:#f00' class='textclass' id='testid'>" +this.value + "</h1>";
    if(this.viewMode == "advanced")
      this.db.object('/users/'+this.userProfile.uid+'/files').update({[this.notePath]:("$1#"+this.formattedNotes)})
    else
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
        this.viewMode = "advanced";
        this.db.object('/users/'+this.userProfile.uid+'/files').update({[this.notePath]:("$1#"+this.formattedNotes)})
        this.snackBar.open("closed quick editor", "undo", {
          duration: 5000,
        }).onAction().subscribe(() => {
          this.viewMode = "quick";
          this.db.object('/users/'+this.userProfile.uid+'/files').update({[this.notePath]:("$0#"+this.value)})
        });

      }
    });
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
       //console.dir(lineElement);
         temp += this.workScreenService.parseText(lineElement, (i<unprocessed.length-1)?unprocessed[i+1]:"", 0)+"\n";
       //let elementObject = Object.assign(lineElement);
       //console.log(elementObject)

      //  if(lineElement.childNodes.length > 1){
      //    let childElements = Array.from(lineElement.childNodes).map(child => {
      //      return {
      //        tag:child.nodeName,
      //        text:child.textContent
      //      }
      //    });
      //    console.log(childElements);
      //    newLine = this.workScreenService.parseText(lineElement, 0)+"\n";
       //
      //  }else switch(lineElement.nodeName){
      //    case "H1":
      //   case "H2":
      //   case "H3":
      //     //console.log("H", lineElement.innerText);
      //     newLine = this.workScreenService.parseText(lineElement, 0)+"\n";
      //     ///if(newLine != formattedLines[i])
      //     //  console.log("new line", newLine, formattedLines[i]);
      //     temp += newLine
       //
      //     break;
      //   case "P":
      //     //console.log("P");
      //     //temp += lineElement.outerHTML;
      //     newLine = this.workScreenService.parseText(lineElement, 0)+"\n";
      //     //if(newLine != formattedLines[i])
      //       //console.log("new line", newLine, formattedLines[i]);
      //     temp += newLine
      //     break;
      //   case "UL":
      //     //console.log("UL");
      //     //temp += lineElement.outerHTML;
      //     break;
      //   case "OL":
      //    //console.log("OL");
      //    //temp += lineElement.outerHTML;
      //    break;
       //
      //  }
     });
    // event.html.split("<p")
    // //.filter(data => data.length>0)
    // .map((d,i) => {
    //   //console.log(d);
    //   if(!(i == 0 && d.length == 0)){
    //       if(d.length > 3){
    //         temp += this.workScreenService.parseText(d.substring(d.indexOf('>')+1, d.length-4), i);
    //
    //       }else{
    //         temp += this.workScreenService.parseText(d, i);
    //       }
    //
    //     lines++;
    //   }
    //   });

       this.formattedNotes = temp;

      //console.log(this.formattedNotes)


  }


  private hasChildren(p){

  }

  private updateContents(newContent:string){
    // let temp = "";
    // let lines = 0;
    // let line = window.getSelection().baseNode.parentElement.id;
    // let carrot = window.getSelection().anchorOffset;
    // console.log(line,carrot);
    // //this.editorBox.nativeElement.innerHTML.split("<p");
    // newContent.split("<p")
    // //.filter(data => data.length>0)
    // .map((d,i) => {
    //   //console.log(d);
    //   if(!(i == 0 && d.length == 0)){
    //     console.dir(document.getElementById(i.toString()));
    //     console.log(i.toString())
    //     if(i.toString() != line && line != "editor-box"){
    //       if(d.length > 3){
    //         //temp += this.workScreenService.parseText(d.substring(d.indexOf('>')+1, d.length-4), i);
    //         if(document.getElementById(i.toString()))
    //           document.getElementById(i.toString()).innerHTML = this.workScreenService.parseText(d.substring(d.indexOf('>')+1, d.length-4), i);
    //       }else{
    //         //temp += this.workScreenService.parseText(d, i);
    //         if(document.getElementById(i.toString()))
    //         document.getElementById(i.toString()).innerHTML = this.workScreenService.parseText(d, i);
    //       }
    //     }
    //     lines++;
    //   }
    //   });

      //document.getElementById('editor-box').className = 'no-blinker';
      // this.formattedNotes = temp;
      //
      // if(this.formattedNotes.length>0)
      //   var timer = setInterval(function(){
      //   //  if((parseInt(line) &&document.getElementById(line)) || document.getElementById(lines.toString())){
      //       clearInterval(timer);
      //       //console.dir(document.getElementById(line), );
      //       //console.log(document.getElementById(line).childNodes[0][length])
      //       var range = document.createRange();
      //       var sel = window.getSelection();
      //       if(line == "editor-box"){
      //         range.setStart(document.getElementById(lines.toString()).childNodes[0],carrot);
      //       }else{
      //         //if(carrot< document.getElementById(line).childNodes[0]['length'])
      //         range.setStart(document.getElementById(line).childNodes[0],carrot);
      //       }
      //
      //       range.collapse(true);
      //       sel.removeAllRanges();
      //       sel.addRange(range);
      //     //  document.getElementById('editor-box').className = '';
      //
      //
      //     //}
      //   }, 1);


      //console.log(this.formattedNotes)


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
