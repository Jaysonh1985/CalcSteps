import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpLookupMaintenanceComponent } from './help-lookup-maintenance.component';

describe('HelpLookupMaintenanceComponent', () => {
  let component: HelpLookupMaintenanceComponent;
  let fixture: ComponentFixture<HelpLookupMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpLookupMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpLookupMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
