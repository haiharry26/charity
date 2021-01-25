import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatorElementsComponent } from './repeator-elements.component';

describe('RepeatorElementsComponent', () => {
  let component: RepeatorElementsComponent;
  let fixture: ComponentFixture<RepeatorElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatorElementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatorElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
