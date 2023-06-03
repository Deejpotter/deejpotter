import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowHeroSectionComponent } from './shadow-hero-section.component';

describe('HeroSectionComponent', () => {
  let component: ShadowHeroSectionComponent;
  let fixture: ComponentFixture<ShadowHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShadowHeroSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShadowHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
