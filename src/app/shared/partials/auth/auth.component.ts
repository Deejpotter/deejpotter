import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(public authService: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.authService.login().subscribe({
      next: () => {
        this.toastr.success('Logged in successfully', 'Success');
      },
      error: (error: Error) => {
        console.error('Login failed:', error.message);
      }
    });
  }

  onSignup(): void {
    this.authService.signUp().subscribe({
      next: () => {
        this.toastr.success('Signed up successfully', 'Success');
      },
      error: (error: Error) => {
        console.error('Signup failed:', error.message);
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: (result) => {
        this.router.navigate(['/']);
        this.toastr.success('Logged out successfully', 'Success');
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toastr.error('Logout failed', 'Error');
      },
    });
  }

}
