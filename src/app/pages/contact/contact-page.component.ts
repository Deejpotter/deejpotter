import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NetlifyFormsService} from 'src/app/shared/services/netlify-forms-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {

  constructor(private fb: FormBuilder,
              private router: Router,
              private netlifyForms: NetlifyFormsService) {
  }


  contactForm: FormGroup = this.fb.group({
    message: ['', Validators.required],
    email: ['', Validators.email]
  });

  errorMsg = '';

  closeError() {
    this.errorMsg = '';
  }

  onSubmit() {
    this.netlifyForms.submitContactForm(this.contactForm.value).subscribe(
      {
        next: () => {
          this.contactForm.reset();
          this.router.navigateByUrl('/contact');
        },
        error: err => {
          this.errorMsg = err;
        }
      }
    );
  }


}
