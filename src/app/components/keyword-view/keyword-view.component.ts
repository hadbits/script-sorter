import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { TranscriptionDataService } from '../../providers/transcription-data.service'
import { Transcription} from '../../models/transcription';
import { ScriptEntity} from '../../models/script-entity';



@Component({
  selector: 'app-keyword-view',
  templateUrl: './keyword-view.component.html',
  styleUrls: ['./keyword-view.component.scss']
})
export class KeywordViewComponent implements OnInit {

  transcription : Transcription;
  keywords : string[];  
  currentEntityIndex : number; 
  currentEntry : any;

  constructor( private transcriptionDataSvc : TranscriptionDataService) { }

  ngOnInit() {
    this.transcriptionDataSvc.currentTranscription.subscribe((trnscrpt) => {
      if (trnscrpt)  {
        this.onTranscriptionUpdate(trnscrpt);
        console.log('keyword view');
      }
    });
  }

  
  onTranscriptionUpdate( transcription : Transcription) {

    this.transcription = transcription;

    this.keywords = this.transcription.keywords;
    
    this.currentEntityIndex = 0;

    if (transcription.currentEntity != 0 ) {
      this.currentEntityIndex = transcription.currentEntity;
    }
    
    this.currentEntry = this.transcription.content[this.currentEntityIndex];

  }

}
