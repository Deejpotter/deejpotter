import { TestBed } from '@angular/core/testing';

import { PageTitleServiceService } from './page-title-service.service';

describe('PageTitleServiceService', () => {
  let service: PageTitleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageTitleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
