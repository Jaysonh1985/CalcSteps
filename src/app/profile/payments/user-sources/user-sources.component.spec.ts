import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSourcesComponent } from './user-sources.component';

describe('UserSourcesComponent', () => {
  let component: UserSourcesComponent;
  let fixture: ComponentFixture<UserSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
