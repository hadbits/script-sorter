import { Component, OnInit } from '@angular/core';
import { TranscriptionDataService } from '../../providers/transcription-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor( private transcriptionDataService : TranscriptionDataService) { }

  ngOnInit() {
    console.log("Home init");
    this.transcriptionDataService.getTransciption().subscribe((obj) => {
      console.log("home gets transciption");      
    });
  };

}
