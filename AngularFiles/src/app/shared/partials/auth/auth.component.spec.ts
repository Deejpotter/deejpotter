import {TestBed} from '@angular/core/testing';
import {ToastrService, ToastrModule, ToastNoAnimationModule} from 'ngx-toastr';

describe('ToastrService', () => {
  let service: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        ToastNoAnimationModule.forRoot()
      ],
      providers: [
        ToastrService
      ]
    });
    service = TestBed.inject(ToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
