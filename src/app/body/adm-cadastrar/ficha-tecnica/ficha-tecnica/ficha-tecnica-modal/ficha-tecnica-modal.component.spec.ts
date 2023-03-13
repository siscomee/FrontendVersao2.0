import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTecnicaModalComponent } from './ficha-tecnica-modal.component';

describe('FichaTecnicaModalComponent', () => {
  let component: FichaTecnicaModalComponent;
  let fixture: ComponentFixture<FichaTecnicaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTecnicaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTecnicaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
