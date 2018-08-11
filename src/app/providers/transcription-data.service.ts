import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Transcription } from '../models/transcription';

@Injectable({
  providedIn: 'root' 
})
export class TranscriptionDataService {

  
  transcriotionSource = new BehaviorSubject<Transcription>(null);
  //currentTranscription : Observable<Transcription>  = this.transcriotionSource.asObservable();


  constructor() { }

  getTransciption(): Observable<Transcription> {
    return this.transcriotionSource.asObservable();
  }

  updateTranscription(transcription : Transcription)  {


    console.log("TranscriptionDataService");
    
    this.transcriotionSource.next(transcription);


    //return "updateTranscription";

  }


}
