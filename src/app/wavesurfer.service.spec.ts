/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WavesurferService } from './wavesurfer.service';

describe('Service: Wavesurfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WavesurferService]
    });
  });

  it('should ...', inject([WavesurferService], (service: WavesurferService) => {
    expect(service).toBeTruthy();
  }));
});
