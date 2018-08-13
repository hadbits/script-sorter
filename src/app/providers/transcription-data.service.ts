import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Transcription } from '../models/transcription';

@Injectable({
  providedIn: 'root' 
})
export class TranscriptionDataService {

  
  transcriotionSource = new BehaviorSubject<Transcription>(null);
  currentTranscription  = this.transcriotionSource.asObservable();


  constructor() { }


  updateTranscription(transcription : Transcription)  {

    console.log("TranscriptionDataService");    
    this.transcriotionSource.next(transcription);


  }


}
