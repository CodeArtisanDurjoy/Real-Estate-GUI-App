import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnDestroy {
  message: string = '';
  type: string = '';
  @Output() closed = new EventEmitter<void>();

  private subscription: Subscription;

  constructor(private messageService: MessageService) {
    this.subscription = this.messageService.alert$.subscribe((alert) => {
      this.message = alert.message;
      this.type = alert.type;
    });
  }

  closeAlert(): void {
    this.messageService.clearAlert();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
