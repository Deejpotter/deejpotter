import { TestBed } from '@angular/core/testing';

import { NetlifyFormsServiceService } from './netlify-forms-service.service';

describe('NetlifyFormsServiceService', () => {
  let service: NetlifyFormsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetlifyFormsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
