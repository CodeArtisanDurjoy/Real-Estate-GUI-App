import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private alertSubject = new Subject<{ message: string; type: string }>();
  alert$ = this.alertSubject.asObservable();
  private destroy$ = new Subject<void>();
  private alertTimer$ = new Subject<void>();

  constructor(private router: Router) {
    this.setupNavigationListener();
  }

  private setupNavigationListener(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.alertTimer$.next(); // Signal to cancel the previous timer

        timer(5000)
          .pipe(takeUntil(this.alertTimer$), takeUntil(this.destroy$))
          .subscribe(() => {
            this.clearAlert();
          });
      }
    });
  }

  showAlert(message: string, type: string): void {
    this.alertTimer$.next(); // Signal to cancel the previous timer
    this.alertSubject.next({ message, type });
  }

  clearAlert(): void {
    this.alertSubject.next({ message: '', type: '' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
