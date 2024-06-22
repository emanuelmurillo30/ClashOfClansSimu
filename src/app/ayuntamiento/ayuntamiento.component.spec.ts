import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyuntamientoComponent } from './ayuntamiento.component';

describe('AyuntamientoComponent', () => {
  let component: AyuntamientoComponent;
  let fixture: ComponentFixture<AyuntamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AyuntamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyuntamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
