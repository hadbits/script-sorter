import { Component, OnInit } from '@angular/core';
import { TranscriptionDataService } from '../../providers/transcription-data.service'
import { Transcription } from '../../models/transcription';
import { FormControl } from '@angular/forms';

import { clipboard } from 'electron';
import { ScriptEntity } from '../../models/script-entity';


@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  transcription: Transcription;
  keywords: string[];
  currentEntityIndex: number;
  currentEntry: any;

  filteredTranscriptsEntities: ScriptEntity[];

  searchText = new FormControl();
  // formParent = new FormGroup({ snoozeReason: new FormControl() });


  constructor(private transcriptionDataSvc: TranscriptionDataService) { }

  filterBySearchString(e: Event) {
    console.log(this.searchText.value.toUpperCase())
    this.filteredTranscriptsEntities = this.transcription.content;
    console.log(this.transcription.content)
    this.filteredTranscriptsEntities = this.filteredTranscriptsEntities.filter(entity =>
      entity.text.toUpperCase().includes(this.searchText.value.toUpperCase())
    );
    console.log(this.filteredTranscriptsEntities)
  }

  ngOnInit() {
    this.transcriptionDataSvc.currentTranscription.subscribe((trnscrpt) => {
      if (trnscrpt) {
        this.onTranscriptionUpdate(trnscrpt);
        console.log('search view');
        console.log(this.searchText.value);
        this.filteredTranscriptsEntities = this.transcription.content;

      }
    });
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

  copyTimestamp(val: string) {
    clipboard.writeText(val);
  }



}
