import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/apiResponse';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly localStorageKey = 'currentUser';
  private loggedIn = false;
  private user: User = {
    id: 0,
    username: '',
    email: '',
  };

  private baseUrl = environment.apiBaseUrl + '/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    public loadingService: LoadingService
  ) {
    const storedUser = localStorage.getItem(this.localStorageKey);
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.loggedIn = true;
    }
  }

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  get currentUser(): User {
    return this.user;
  }

  login(email: string, password: string): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(
        `${this.baseUrl}/signin`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.loggedIn = true;
            this.user = response.user;
            // Save the current user to local storage
            localStorage.setItem(
              this.localStorageKey,
              JSON.stringify(this.user)
            );
          }
        })
      );
  }

  signup(
    username: string,
    email: string,
    password: string
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/signup`,
      { username, email, password },
      { withCredentials: true }
    );
  }

  logout(): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(`${this.baseUrl}/signout`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.loggedIn = false;
            this.user = {
              id: 0,
              username: '',
              email: '',
              password: '',
            };

            localStorage.removeItem(this.localStorageKey);
          }
        })
      );
  }

  signInWithGoogle(): void {
    const provider = new firebase.auth.GoogleAuthProvider();

    this.loadingService.show();

    from(firebase.auth().signInWithPopup(provider))
      .pipe(
        switchMap((result) => {
          const username = result.user?.displayName;
          const email = result.user?.email;
          const avatar = result.user?.photoURL;

          return this.http.post<ApiResponse>(
            `${this.baseUrl}/googleAuth`,
            {
              username,
              email,
              avatar,
            },
            { withCredentials: true }
          );
        }),
        tap((response) => {
          this.loadingService.hide();
          if (response && response.success) {
            this.loggedIn = true;
            this.user = response.user;
            localStorage.setItem(
              this.localStorageKey,
              JSON.stringify(this.user)
            );
            this.messageService.showAlert(
              'Login successful! Welcome back!',
              'success'
            );
            this.router.navigate(['']);
            console.log('current user is', this.user);
          } else {
            this.messageService.showAlert(
              `Login failed: ${response.message}`,
              'error'
            );
          }
        }),
        catchError((error) => {
          this.loadingService.hide();
          this.messageService.showAlert(`Login failed: ${error}`, 'error');
          return throwError(() => error);
        }),
        take(1)
      )
      .subscribe();
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  getCurrentUser(): User {
    return this.user;
  }

  logoutLocally() {
    this.loggedIn = false;
    this.user = {
      id: 0,
      username: '',
      email: '',
      password: '',
    };

    localStorage.removeItem(this.localStorageKey);
  }
}
