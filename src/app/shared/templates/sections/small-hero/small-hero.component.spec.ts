import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallHeroComponent } from './small-hero.component';

describe('SmallHeroComponent', () => {
  let component: SmallHeroComponent;
  let fixture: ComponentFixture<SmallHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallHeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
