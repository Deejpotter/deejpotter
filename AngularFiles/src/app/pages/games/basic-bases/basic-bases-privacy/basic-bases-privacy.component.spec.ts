import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicBasesPrivacyComponent } from './basic-bases-privacy.component';

describe('BasicBasesPrivacyComponent', () => {
  let component: BasicBasesPrivacyComponent;
  let fixture: ComponentFixture<BasicBasesPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicBasesPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicBasesPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
