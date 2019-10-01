import { TestBed, inject } from '@angular/core/testing';

import { TranscriptionDataService } from './transcription-data.service';

describe('TranscriptionDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranscriptionDataService]
    });
  });

  it('should be created', inject([TranscriptionDataService], (service: TranscriptionDataService) => {
    expect(service).toBeTruthy();
  }));
});
