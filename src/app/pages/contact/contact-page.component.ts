import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-contact',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private router: Router) {
  }


  contactForm: FormGroup = this.fb.group({
    message: ['', Validators.required],
    email: ['', Validators.email]
  });

  errorMsg = '';

  closeError() {
    this.errorMsg = '';
  }

  submitContactForm(contactFormEntry: any): Observable<any> {
    const entry = new HttpParams({
      fromObject: {
        contactFormEntry
      }
    });

    return this.submitEntry(entry);
  }

  private submitEntry(entry: HttpParams): Observable<any> {
    return this.http.post(
      '/contact/index.html',
      entry.toString(),
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        responseType: 'text'
      }
    ).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errMsg = '';

    if (err.error instanceof ErrorEvent) {
      errMsg = `A client-side error occurred: ${err.error.message}`;
    } else {
      errMsg = `A server-side error occurred. Code: ${err.status}. Message: ${err.message}`;
    }

    return throwError(() => new Error(errMsg));
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitContactForm(this.contactForm.value).subscribe(
      {
        next: () => {
          this.contactForm.reset();
          this.router.navigateByUrl('/');
        },
        error: err => {
          this.errorMsg = err;
        }
      }
    );
  }


}
