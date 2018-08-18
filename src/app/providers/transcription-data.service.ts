import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Transcription } from '../models/transcription';

@Injectable({
  providedIn: 'root' 
})
export class TranscriptionDataService {

  
  transcriptionSource = new BehaviorSubject<Transcription>(null);
  currentTranscription  = this.transcriptionSource.asObservable();

  readOnlyStatus = new BehaviorSubject<boolean>(false);
  currentReadOnlyStatus  = this.readOnlyStatus.asObservable();

  constructor() { }


  // loadNewTranscription(transcription : Transcription)  {
  //   console.log("TranscriptionDataService - loadNewTranscription");    
  //   this.transcriptionSource.next(transcription);
  // }

  updateTranscription(transcription : Transcription)  {
    console.log("TranscriptionDataService - updateTranscription");    
    this.transcriptionSource.next(transcription);
  }

  setReadOnlyStatus(isReadOnly : boolean) {
    console.log("TranscriptionDataService - isReadOnly");    
    this.readOnlyStatus.next(isReadOnly);
  }

}
