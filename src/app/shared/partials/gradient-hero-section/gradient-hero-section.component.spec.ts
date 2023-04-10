import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientHeroSectionComponent } from './gradient-hero-section.component';

describe('GradientHeroSectionComponent', () => {
  let component: GradientHeroSectionComponent;
  let fixture: ComponentFixture<GradientHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradientHeroSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradientHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
