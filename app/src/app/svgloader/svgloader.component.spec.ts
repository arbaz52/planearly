import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgloaderComponent } from './svgloader.component';

describe('SvgloaderComponent', () => {
  let component: SvgloaderComponent;
  let fixture: ComponentFixture<SvgloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgloaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
