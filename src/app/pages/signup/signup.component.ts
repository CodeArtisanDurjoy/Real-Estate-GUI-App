import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
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
  }

  signup(signupForm: NgForm): void {
    this.loadingService.show();

    console.log('email is', this.email);
    console.log('username is', this.username);
    console.log('password is', this.password);

    if (signupForm.valid) {
      this.authService
        .signup(this.username, this.email, this.password)
        .subscribe({
          next: (response) => {
            this.loadingService.hide();
            if (response && response.success) {
              this.messageService.showAlert(
                'Signup successful. Welcome!',
                'success'
              );

              this.router.navigate(['/login']);
            } else {
              this.messageService.showAlert(
                'Encountered error in signing up. Please try again.',
                'error'
              );
            }
          },
          error: (response) => {
            this.loadingService.hide();

            if (response && response.success) {
              this.messageService.showAlert(
                'Signup successful. Welcome!',
                'success'
              );

              this.router.navigate(['/login']);
            } else {
              this.messageService.showAlert(
                'Encountered error in signing up. Please try again.',
                'error'
              );
            }
          },
        });
    } else {
      this.loadingService.hide();

      this.messageService.showAlert(
        'Invalid username or password. Please check your inputs and try again.',
        'error'
      );
    }
  }

  googleAuth() {
    this.authService.signInWithGoogle();
  }
}
