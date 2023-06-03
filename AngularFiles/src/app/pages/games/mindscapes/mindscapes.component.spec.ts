import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MindscapesComponent } from './mindscapes.component';

describe('MindscapesComponent', () => {
  let component: MindscapesComponent;
  let fixture: ComponentFixture<MindscapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MindscapesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MindscapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
