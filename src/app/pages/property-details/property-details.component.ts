import { Component, OnInit } from '@angular/core';
import { Listing } from '../../models/listing';
import { ActivatedRoute } from '@angular/router';
import { ListingsService } from '../../services/listings.service';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';
import { MessageService } from '../../services/message.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css',
})
export class PropertyDetailsComponent implements OnInit {
  listing: Listing = {
    imageUrls: ['https://i.imgur.com/n6B1Fuw.jpg'],
    name: '',
    description: '',
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    price: 0,
    parking: false,
    furnished: false,
    userId: '',
  };

  landlord: User = {
    id: 0,
    username: 'mo',
    email: 'mo@gmail.com',
  };

  constructor(
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private messageService: MessageService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    const params = this.route.snapshot.paramMap;
    const propertyId = parseInt(params.get('id') || '-1', 10);

    this.listingsService.getProperty(propertyId).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.listing = response.listings[0];

          const userId = this.listing.userId || '-1';

          this.usersService.getUser(parseInt(userId)).subscribe({
            next: (response) => {
              this.loadingService.hide();

              if (response && response.success) {
                this.landlord = response.user;
              } else {
                this.loadingService.hide();

                this.messageService.showAlert(
                  'Error fetching user. Please try again.',
                  'error'
                );
              }
            },
            error: (error) => {
              this.loadingService.hide();

              if (error && error.success) {
                this.landlord = error.user;
              } else {
                this.loadingService.hide();

                this.messageService.showAlert(
                  'Error fetching user. Please try again.',
                  'error'
                );
              }
            },
          });
        } else {
          this.loadingService.hide();
          this.messageService.showAlert(
            'Error fetching property. Please try again.',
            'error'
          );
        }
      },
      error: (error) => {
        if (error && error.success) {
          this.listing = error.listings[0];

          const userId = this.listing.userId || '-1';

          this.usersService.getUser(parseInt(userId)).subscribe({
            next: (response) => {
              this.loadingService.hide();

              if (response && response.success) {
                this.landlord = response.user;
              } else {
                this.loadingService.hide();

                this.messageService.showAlert(
                  'Error fetching user. Please try again.',
                  'error'
                );
              }
            },
            error: (response) => {
              this.loadingService.hide();

              if (response && response.success) {
                this.landlord = response.user;
              } else {
                this.loadingService.hide();

                this.messageService.showAlert(
                  'Error fetching user. Please try again.',
                  'error'
                );
              }
            },
          });
        }
      },
    });
  }

  sendEmail(contactForm: NgForm): void {
    const subject = `Regarding ${this.listing.name}`;
    const message = contactForm.value.message;
    const senderEmail = encodeURIComponent(contactForm.value.email);
    const senderName = encodeURIComponent(contactForm.value.name);

    const emailLink = `mailto:${
      this.landlord.email
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      message
    )}&from=${senderEmail}&sender=${senderName}`;
    window.location.href = emailLink;
  }
}
