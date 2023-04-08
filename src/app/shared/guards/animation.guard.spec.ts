import { TestBed } from '@angular/core/testing';

import { AnimationGuard } from './animation.guard';

describe('AnimationGuard', () => {
  let guard: AnimationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AnimationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
