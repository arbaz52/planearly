import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickEntityComponent } from './pick-entity.component';

describe('PickEntityComponent', () => {
  let component: PickEntityComponent;
  let fixture: ComponentFixture<PickEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
