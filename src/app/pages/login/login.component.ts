import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    public loadingService: LoadingService
  ) {
    window.scrollTo(0, 0);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event:', event);
      }
    });
  }

  login(loginForm: NgForm): void {
    this.loadingService.show();
    if (loginForm.valid) {
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.success) {
            this.messageService.showAlert(
              'Login successful! Welcome back!',
              'success'
            );
            this.router.navigate(['']);
          } else {
            this.messageService.showAlert(
              `Login failed: ${response.message}`,
              'error'
            );
          }
        },
        error: (response) => {
          this.loadingService.hide();
          if (response && response.success) {
            this.messageService.showAlert(
              'Login successful! Welcome back!',
              'success'
            );
            this.router.navigate(['']);
          } else {
            this.messageService.showAlert(
              'Oops! Something went wrong during login. Please try again later.',
              'error'
            );
          }
        },
      });
    } else {
      this.messageService.showAlert(
        'Invalid email or password. Please check your credentials and try again.',
        'error'
      );
    }
  }

  googleAuth() {
    this.authService.signInWithGoogle();
  }
}
