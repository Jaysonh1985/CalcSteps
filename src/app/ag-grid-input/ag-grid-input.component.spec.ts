import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridInputComponent } from './ag-grid-input.component';

describe('AgGridInputComponent', () => {
  let component: AgGridInputComponent;
  let fixture: ComponentFixture<AgGridInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
