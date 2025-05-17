import { Component, OnInit } from '@angular/core';
import { Listing } from '../../models/listing';
import { ListingsService } from '../../services/listings.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  searchTerm = '';
  listings: Listing[] = [];
  private listingsSubscription: Subscription | undefined;

  constructor(
    private listingService: ListingsService,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.listingsSubscription = this.listingService.listings$.subscribe(
      (listings) => {
        this.listings = listings;
      }
    );
  }

  onSubmitForm() {
    console.log('search term is', this.searchTerm);
    this.router.navigate(['/search'], {
      queryParams: { searchTerm: this.searchTerm, limit: 9 },
    });
  }

  ngOnDestroy() {
    if (this.listingsSubscription) {
      this.listingsSubscription.unsubscribe();
    }
  }

  sendEmail(contactForm: NgForm): void {
    const companyEmail = 'mo@gmail.com';
    const subject = `Enquiry`;
    const message = contactForm.value.message;
    const senderEmail = encodeURIComponent(contactForm.value.email);
    const senderName = encodeURIComponent(contactForm.value.name);

    const emailLink = `mailto:${companyEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      message
    )}&from=${senderEmail}&sender=${senderName}`;
    window.location.href = emailLink;
  }
}
