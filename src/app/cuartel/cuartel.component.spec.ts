import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuartelComponent } from './cuartel.component';

describe('CuartelComponent', () => {
  let component: CuartelComponent;
  let fixture: ComponentFixture<CuartelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuartelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuartelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
