import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateGuestSelectorComponent } from './date-guest-selector.component';

describe('DateGuestSelectorComponent', () => {
  let component: DateGuestSelectorComponent;
  let fixture: ComponentFixture<DateGuestSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateGuestSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DateGuestSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
