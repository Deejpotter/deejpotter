import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicBasesComponent} from './basic-bases.component';

describe('BaseGame2Component', () => {
  let component: BasicBasesComponent;
  let fixture: ComponentFixture<BasicBasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicBasesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BasicBasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
