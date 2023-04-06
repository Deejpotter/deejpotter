import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-contact',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
  private formAction: string = "https://deejpotter.com/your-form-action";

  constructor(private fb: FormBuilder) {
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
  }


}
