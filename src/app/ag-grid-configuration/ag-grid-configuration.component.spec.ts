import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridConfigurationComponent } from './ag-grid-configuration.component';

describe('AgGridConfigurationComponent', () => {
  let component: AgGridConfigurationComponent;
  let fixture: ComponentFixture<AgGridConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
