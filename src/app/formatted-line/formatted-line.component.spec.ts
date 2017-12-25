import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedLineComponent } from './formatted-line.component';

describe('FormattedLineComponent', () => {
  let component: FormattedLineComponent;
  let fixture: ComponentFixture<FormattedLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormattedLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattedLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
