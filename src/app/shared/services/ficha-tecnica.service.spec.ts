/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FichaTecnicaService } from './ficha-tecnica.service';

describe('Service: FichaTecnica', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FichaTecnicaService],
    });
  });

  it('should ...', inject(
    [FichaTecnicaService],
    (service: FichaTecnicaService) => {
      expect(service).toBeTruthy();
    }
  ));
});
