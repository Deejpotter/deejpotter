import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {User} from 'netlify-identity-widget';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  currentUser: User | null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.currentUser = null;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  onLogin(): void {
    this.authService.login();
  }

  onSignup(): void {
    this.authService.signUp();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: (result) => {
        this.router.navigate(['/']);
        this.toastr.success('Logged out successfully', 'Success');
        this.currentUser = null;
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toastr.error('Logout failed', 'Error');
      },
    });
  }
}
