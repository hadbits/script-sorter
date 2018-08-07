import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { clipboard, ipcRenderer, dialog, remote} from 'electron';
import { Transcription} from '../../models/transcription';
import { ScriptEntity} from '../../models/script-entity';

import * as fs from 'fs';


@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnInit {

  @Output() fileRead = new EventEmitter<Transcription>();
  @Input()  updatedFile : Transcription;

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

  constructor() { 
    this.isReadOnly = true;
    
    this.transcription = new Transcription;
    this.keywords = [];

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

      this.transcription = new Transcription;
      this.keywords = [];

      try {
          let fileContent : any = JSON.parse(content);

          if (fileContent && fileContent.content && fileContent.keywords) {
            this.transcription = fileContent;
            this.keywords = this.transcription.keywords;
            
            this.currentEntityIndex = 0;
            this.currentEntry = this.transcription.content[this.currentEntityIndex];

            this.isReadOnly = true;

            //console.log(this.transcription);

            this.fileRead.emit(this.transcription);


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
      console.log("Emitting fileread event");

      this.fileRead.emit(this.transcription);

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
        fs.writeFile(filename, JSON.stringify(this.updatedFile), (err) => {
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

}
