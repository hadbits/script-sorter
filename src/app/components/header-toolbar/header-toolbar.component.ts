import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { clipboard, ipcRenderer, dialog, remote} from 'electron';
import { Transcription} from '../../models/transcription';
import { ScriptEntity} from '../../models/script-entity';

import * as fs from 'fs';
import { TranscriptionDataService } from '../../providers/transcription-data.service';


@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnInit {


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

  constructor(private transcriptionDataSvc : TranscriptionDataService ) { 
    this.isReadOnly = false;
    
    this.transcription = new Transcription;
    this.keywords = [];

  }

  ngOnInit() {
    this.shareOpenedFile();

  };

  switchReadOnly(event) {
    console.log(event);
    this.isReadOnly = event.checked;
    this.transcriptionDataSvc.setReadOnlyStatus(this.isReadOnly)    
  }


  OpenFile (event) {

    //console.log("Open dialog by button");
    ipcRenderer.send('open-file-dialog')
  }

  shareOpenedFile() {

    ipcRenderer.on('fileOpened', (event, response) => { 
      
      let content: string = response.toString();

      this.transcription = new Transcription;
      this.keywords = [];


      try {
          let fileContent : any = JSON.parse(content);

          if (fileContent && fileContent.content && fileContent.keywords) {
            this.transcription = fileContent;
            this.keywords = this.transcription.keywords;
            
            this.currentEntityIndex = 0;
            this.currentEntry = this.transcription.content[this.currentEntityIndex];
            this.transcription.currentEntity = this.currentEntityIndex;

            this.isReadOnly = true;        

            this.transcriptionDataSvc.updateTranscription(this.transcription)
            this.transcriptionDataSvc.setReadOnlyStatus(this.isReadOnly)

            return true;
          }

      } catch (e) {
      }



     this.keywords = [];
     this.latestKeyword = "";
     
     this.arrEntities = content.split(/\n(?=\d{2}:)/i) ;        

     
     this.arrEntities.forEach((entity, i) => {
       this.arrTimeText = entity.split(/\n(?=.*)/i)
       let item : ScriptEntity;
       item = new ScriptEntity();
       item.id = i;
       item.keywords = "";

       this.arrTimeText.forEach((timeText, k) => {
         if (timeText != "" && timeText.search(/\d{2}:/i) > -1) {
           this.arrTime = timeText.split(/\s+/i);            
           
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
       this.transcription.currentEntity = this.currentEntityIndex;


       this.isReadOnly = false;


     });


     this.cards = this.transcription.content;
     this.transcriptionDataSvc.updateTranscription(this.transcription)
     this.transcriptionDataSvc.setReadOnlyStatus(this.isReadOnly)


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
        fs.writeFile(filename, JSON.stringify(this.transcription ), (err) => {
          if(err){
              alert("An error ocurred creating the file "+ err.message)
          }                      
          alert("The file has been succesfully saved");
      });

      } 
    );

  } 

  // fileOpened(event, response) {
  //   console.log("File Opened captured");
  // }

}
