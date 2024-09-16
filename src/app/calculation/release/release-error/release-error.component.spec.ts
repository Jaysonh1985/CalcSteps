import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseErrorComponent } from './release-error.component';

describe('ReleaseErrorComponent', () => {
  let component: ReleaseErrorComponent;
  let fixture: ComponentFixture<ReleaseErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
