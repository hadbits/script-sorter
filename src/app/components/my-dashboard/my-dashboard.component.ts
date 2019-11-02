import { Component, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { clipboard, ipcRenderer, dialog, remote } from 'electron';
import { Transcription } from '../../models/transcription';
import { ScriptEntity } from '../../models/script-entity';

import * as fs from 'fs';
import { TranscriptionDataService } from '../../providers/transcription-data.service';


@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss']
})
export class MyDashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */

  @ViewChild("dashboardCurrEntry", { read: ElementRef, static: false })
  dashboardCurrEntry: ElementRef;

  transcriptionSubscription: any;

  cards: any[];
  isReadOnly: boolean;

  arrEntities: any[];
  arrTimeText: any[];
  arrTime: any[];
  currentEntityIndex: number;
  keywords: string[];

  transcription: Transcription;

  currentEntry: any;
  latestKeyword: string;

  pressedKey: any;


  constructor(private breakpointObserver: BreakpointObserver, private transcriptionDataSvc: TranscriptionDataService) {

    // console.log(this.cards);
    // console.log(ipcRenderer);

  }

  ngOnInit() {
    this.transcriptionDataSvc.currentTranscription.subscribe((trnscrpt) => {
      if (trnscrpt) {
        this.onTranscriptionUpdate(trnscrpt);
      }
    });

    this.transcriptionDataSvc.currentReadOnlyStatus.subscribe((readOnlyStatus) => {
      this.isReadOnly = readOnlyStatus;
      // console.log("===> " + readOnlyStatus);
    });

  };



  onTranscriptionUpdate(transcription: Transcription) {

    this.transcription = transcription;

    this.keywords = this.transcription.keywords;

    this.currentEntityIndex = 0;

    if (transcription.currentEntity != 0) {
      this.currentEntityIndex = transcription.currentEntity;
    }

    this.currentEntry = this.transcription.content[this.currentEntityIndex];

  }



  copyTimestamp() {
    clipboard.writeText(this.currentEntry.startTime);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.pressedKey = event.key;
    console.log(this.pressedKey);


    switch (this.pressedKey) {
      case 'ArrowUp':
      case 'ArrowLeft':
        //this.currentEntityIndex--;
        //if (this.currentEntityIndex < 0) {this.currentEntityIndex = 0;}
        //this.currentEntry = this.transcription.content[this.currentEntityIndex];
        this.proceedToEntityByIncrement(-1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        //this.currentEntityIndex++;
        //if (this.currentEntityIndex > this.transcription.content.length - 1) {this.currentEntityIndex = this.transcription.content.length - 1;}
        //this.currentEntry = this.transcription.content[this.currentEntityIndex];
        this.proceedToEntityByIncrement(1);
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

        break;

    }

  }


  proceedToEntityByIncrement(increment: number) {
    this.currentEntityIndex += increment;
    if (this.currentEntityIndex < 0) {
      this.currentEntityIndex = 0;
    }

    if (this.currentEntityIndex > this.transcription.content.length - 1) {
      this.currentEntityIndex = this.transcription.content.length - 1;
    }
    this.transcription.currentEntity = this.currentEntityIndex;
    this.currentEntry = this.transcription.content[this.currentEntityIndex];

    // console.log(!this.isReadOnly)

    if (!this.isReadOnly && increment > 0) {
      this.transcription.content[this.currentEntityIndex].keywords = this.transcription.content[this.currentEntityIndex - 1].keywords;
    }

    // console.log(this.transcription);

  }



  addKeyword() {
    if (this.latestKeyword != "" && !this.keywords.includes(this.latestKeyword)) {
      this.keywords.push(this.latestKeyword);
      this.assignKeywordToCurrentEntry(this.keywords.length - 1, true);
      this.latestKeyword = "";
    }
    //console.log(this.dashboardCurrEntry);    
  };

  assignKeywordToCurrentEntry(pressedKey: number, isAssign: boolean) {
    let kwds: String = this.transcription.content[this.currentEntityIndex].keywords;
    if (isAssign) {
      if (this.transcription.content.length > 0 && this.keywords.length > pressedKey) {
        if (kwds == "") {
          kwds = this.keywords[pressedKey];
        }
        else {
          kwds += ",";
          if (!kwds.includes(this.keywords[pressedKey] + ",")) {
            kwds += this.keywords[pressedKey];
          }
          else {
            kwds = kwds.slice(0, -1);
          }
        }
      }
    }
    else {
      kwds += ",";
      // console.log(kwds);
      kwds = kwds.replace(this.keywords[pressedKey] + ",", "");
      kwds = kwds.slice(0, -1);
      // console.log(kwds);
    }

    this.transcription.content[this.currentEntityIndex].keywords = kwds;

    this.transcriptionDataSvc.updateTranscription(this.transcription);
    // console.log(this.transcription);

    this.dashboardCurrEntry.nativeElement.focus();


  }


  isKeywordChecked(index: number, event: any) {
    if (event.checked) {
      this.assignKeywordToCurrentEntry(index, true);
    }
    else {
      this.assignKeywordToCurrentEntry(index, false);
    }
    console.log(event);
  }

  isKeywordAssigned(keyword: string): boolean {
    let currEntyKeywords: string = this.currentEntry.keywords;
    currEntyKeywords = "," + currEntyKeywords + ",";
    if (currEntyKeywords.includes("," + keyword + ",")) {
      return true;
    }
    else {
      return false;
    }
  }






}

