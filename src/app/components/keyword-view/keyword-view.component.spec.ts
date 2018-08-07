import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordViewComponent } from './keyword-view.component';

describe('KeywordViewComponent', () => {
  let component: KeywordViewComponent;
  let fixture: ComponentFixture<KeywordViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
