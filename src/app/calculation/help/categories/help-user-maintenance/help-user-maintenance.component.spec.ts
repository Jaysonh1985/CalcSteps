import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpUserMaintenanceComponent } from './help-user-maintenance.component';

describe('HelpUserMaintenanceComponent', () => {
  let component: HelpUserMaintenanceComponent;
  let fixture: ComponentFixture<HelpUserMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpUserMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpUserMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
