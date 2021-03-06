import { Component, OnInit } from '@angular/core';
import { TranscriptionDataService } from '../../providers/transcription-data.service'
import { Transcription } from '../../models/transcription';
import { FormControl } from '@angular/forms';

import { clipboard } from 'electron';
import { ScriptEntity } from '../../models/script-entity';


@Component({
  selector: 'app-keyword-view',
  templateUrl: './keyword-view.component.html',
  styleUrls: ['./keyword-view.component.scss']
})
export class KeywordViewComponent implements OnInit {

  transcription: Transcription;
  keywords: string[];
  currentEntityIndex: number;
  currentEntry: any;

  filteredTranscriptsEntities: ScriptEntity[];

  tags = new FormControl();
  // formParent = new FormGroup({ snoozeReason: new FormControl() });

  constructor(private transcriptionDataSvc: TranscriptionDataService) { }

  ngOnInit() {
    this.transcriptionDataSvc.currentTranscription.subscribe((trnscrpt) => {
      if (trnscrpt) {
        this.onTranscriptionUpdate(trnscrpt);
        console.log('keyword view');
        console.log(this.tags.value);
        this.filteredTranscriptsEntities = this.transcription.content;

      }
    });
  }

  copyTimestamp(val: string) {
    clipboard.writeText(val);
  }



  filterByTags(e: Event) {
    console.log("chnaged")
    this.filteredTranscriptsEntities = this.transcription.content;
    this.tags.value.forEach(tag =>
      this.filteredTranscriptsEntities = this.filteredTranscriptsEntities.filter(entity =>
        entity.keywords.includes(tag)
      )
    );
    console.log(this.filteredTranscriptsEntities)
  }

  onTranscriptionUpdate(transcription: Transcription) {

    this.transcription = transcription;

    this.keywords = this.transcription.keywords;

    this.currentEntityIndex = 0;

    if (transcription.currentEntity != 0) {
      this.currentEntityIndex = transcription.currentEntity;
    }

    this.currentEntry = this.transcription.content[this.currentEntityIndex];

  }

}
