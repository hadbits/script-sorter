import { Component, HostListener  } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { clipboard, ipcRenderer, dialog, remote} from 'electron';
import { Transcription} from '../models/transcription';
import { ScriptEntity} from '../models/script-entity';

import * as fs from 'fs';


@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss']
})
export class MyDashboardComponent  {
  /** Based on the screen size, switch from standard to one column per row */

  //ipcRndr : ipcRenderer;

  cards : any[];
  isReadOnly : boolean;

  arrEntities : any[];
  arrTimeText: any[];
  arrTime: any[];
  currentEntityIndex: number;
  keywords : string[];

  //jsnContent : any = {};
  transcription : Transcription;

  currentEntry : any;
  latestKeyword : string;

  pressedKey : any;


  constructor(private breakpointObserver: BreakpointObserver) {

    this.isReadOnly = true;
    
    this.transcription = new Transcription;
    this.keywords = [];
    this.latestKeyword = "";


    console.log(this.cards);
    console.log(ipcRenderer);

}





  ngOnInit() {

    this.readOpenedFile();

  };


  OpenFile (event) {

    console.log("Open dialog by button");
    ipcRenderer.send('open-file-dialog')
     //this.ipcRndr.send('open-file-dialog')
     //openSRTFile();
  }


  readOpenedFile()  {

    ipcRenderer.on('fileOpened', (event, response) => {
      //console.log(event);
      //console.log(response);

      //console.log("File Opened captured");

      let content: string = response.toString();
      //console.log(content);

      try {
          let fileContent : any = JSON.parse(content);

          if (fileContent && fileContent.content && fileContent.keywords) {
            this.transcription = fileContent;
            this.keywords = this.transcription.keywords;
            
            this.currentEntityIndex = 0;
            this.currentEntry = this.transcription.content[this.currentEntityIndex];

            this.isReadOnly = true;

            //console.log(this.transcription);

            return true;
          }

      } catch (e) {
          //return false;
      }


      //this.transcription.content = [];
      this.keywords = [];
      this.latestKeyword = "";
      
      this.arrEntities = content.split(/\n(?=\d{2}:)/i) ;        

      
      this.arrEntities.forEach((entity, i) => {
        this.arrTimeText = entity.split(/\n(?=.*)/i)
        //let item = {id: i, startTime: "", endTime : "", text : "", keywords : ""};
        let item : ScriptEntity;
        item = new ScriptEntity();
        item.id = i;
        item.keywords = "";

        this.arrTimeText.forEach((timeText, k) => {
          if (timeText != "" && timeText.search(/\d{2}:/i) > -1) {
            this.arrTime = timeText.split(/\s+/i);            
            //console.log(this.arrTime);
            
            this.arrTime.forEach((time, t) => {

              if (item.startTime != null && time.search(/\d{2}:/i) > -1) {    //if first startTme is set, then set end time
                item.endTime = time;
              }
              else if (item.startTime == null && time.search(/\d{2}:/i) > -1) {   //set first date found to startTime
                item.startTime = time;
              }


              //if (time.search(/\d{2}:/i) > -1) {}
            });
          }
          else if (timeText.search(/\S/i) > -1) {
            item.text = timeText;
          }
        });

        

        this.transcription.content.push(item);

        this.currentEntityIndex = 0;
        this.currentEntry = this.transcription.content[this.currentEntityIndex];

        this.isReadOnly = false;


      });


      this.cards = this.transcription.content;
      //console.log(this.cards);


    });
  }

  saveFile () {

    remote.dialog.showSaveDialog({
      title: "Save File",
      filters: [
                  {
                    name: 'Script Sorter Files', 
                    extensions: ['sst']
                  }
              ]        
      },
      (filename, bookmark) =>  {
        // fileName is a string that contains the path and filename created in the save file dialog.  
        fs.writeFile(filename, JSON.stringify(this.transcription), (err) => {
          if(err){
              alert("An error ocurred creating the file "+ err.message)
          }                      
          alert("The file has been succesfully saved");
      });

      } 
    );

  } 

  fileOpened(event, response) {
    console.log("File Opened captured");
  }

  copyTimestamp() {
    clipboard.writeText(this.currentEntry.startTime);   
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.pressedKey = event.key;
    //console.log(this.pressedKey);

    
    switch (this.pressedKey) {
      case 'ArrowUp':
      case 'ArrowLeft': 
        this.currentEntityIndex--;
        if (this.currentEntityIndex < 0) {this.currentEntityIndex = 0;}
        this.currentEntry = this.transcription.content[this.currentEntityIndex];
        break;
      case 'ArrowRight': 
      case 'ArrowDown': 
        this.currentEntityIndex++;
        if (this.currentEntityIndex > this.transcription.content.length - 1) {this.currentEntityIndex = this.transcription.content.length - 1;}
        this.currentEntry = this.transcription.content[this.currentEntityIndex];
        break; 
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':

        this.assignKeywordToCurrentEntry(parseInt(this.pressedKey), true);

        //console.log(this.transcription.content);
        break;

    }

  }
  


  addKeyword() {
    if (this.latestKeyword != "" && !this.keywords.includes(this.latestKeyword)) {
      this.keywords.push(this.latestKeyword);
      this.assignKeywordToCurrentEntry(this.keywords.length-1, true);
      this.transcription.keywords.push(this.latestKeyword);
      this.latestKeyword = "";      
    }
    console.log(this.keywords);    
  };

  assignKeywordToCurrentEntry(pressedKey : number, isAssign: boolean) {
    //console.log(pressedKey);
    if (isAssign) {
      if (this.transcription.content.length > 0 && this.keywords.length >= pressedKey) {
        //console.log(this.transcription.content[this.currentEntityIndex].keywords);
        if (this.transcription.content[this.currentEntityIndex].keywords != "") {
          this.transcription.content[this.currentEntityIndex].keywords += "," + this.keywords[pressedKey];
        }
        else {
          this.transcription.content[this.currentEntityIndex].keywords = this.keywords[pressedKey];
        }
      }
    }
    else {
      let kwds : String = this.transcription.content[this.currentEntityIndex].keywords;
      kwds += ",";
      kwds = kwds.replace(this.keywords[pressedKey] + ",", "");
      kwds = kwds.slice(0, -1);
      this.transcription.content[this.currentEntityIndex].keywords = kwds;
    }

    console.log(this.transcription);

  }


  isKeywordChecked(index: number, event : any) {
    console.log(event.checked); 
    if (event.checked) {
      this.assignKeywordToCurrentEntry(index, true);
    }
    else {
      this.assignKeywordToCurrentEntry(index, false);
    }
    
  }



}

