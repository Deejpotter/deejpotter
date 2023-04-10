import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSectionComponent } from './basic-section.component';

describe('BasicSectionComponent', () => {
  let component: BasicSectionComponent;
  let fixture: ComponentFixture<BasicSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
