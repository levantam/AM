import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrossNetConversionComponent } from './gross-net-conversion.component';

describe('GrossNetConversionComponent', () => {
  let component: GrossNetConversionComponent;
  let fixture: ComponentFixture<GrossNetConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrossNetConversionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrossNetConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
