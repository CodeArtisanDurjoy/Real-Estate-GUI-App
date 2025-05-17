import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Listing } from '../../models/listing';
import { ListingsService } from '../../services/listings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-update-property',
  templateUrl: './update-property.component.html',
  styleUrl: './update-property.component.css',
})
export class UpdatePropertyComponent implements OnInit {
  propertyId = -1;
  propertyName = '';
  propertyDescription = '';
  address = '';
  bedrooms = 0;
  bathrooms = 0;
  parking = false;
  furnished = false;
  propertyPrice = 0;

  constructor(
    private listingsService: ListingsService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    public loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    window.scrollTo(0, 0);
    const params = this.route.snapshot.paramMap;
    this.propertyId = parseInt(params.get('id') || '-1', 10);

    this.loadingService.show();

    this.listingsService.getProperty(this.propertyId).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.success) {
          this.propertyName = response.listings[0].name || '';
          this.propertyDescription = response.listings[0].description || '';
          this.address = response.listings[0].address || '';
          this.bedrooms = response.listings[0].bedrooms || 0;
          this.bathrooms = response.listings[0].bathrooms || 0;
          this.parking = response.listings[0].parking || false;
          this.furnished = response.listings[0].furnished || false;
          this.propertyPrice = response.listings[0].price || 0;
        } else {
          this.messageService.showAlert(
            'Error fetching property. Please try again.',
            'error'
          );
        }
      },
      error: (response) => {
        this.loadingService.hide();
        if (response && response.success) {
          this.propertyName = response.listings[0].name || '';
          this.propertyDescription = response.listings[0].description || '';
          this.address = response.listings[0].address || '';
          this.bedrooms = response.listings[0].bedrooms || 0;
          this.bathrooms = response.listings[0].bathrooms || 0;
          this.parking = response.listings[0].parking || false;
          this.furnished = response.listings[0].furnished || false;
          this.propertyPrice = response.listings[0].price || 0;
        } else {
          this.messageService.showAlert(
            'Error fetching property. Please try again.',
            'error'
          );
        }
      },
    });
  }

  onUpdateProperty(updatePropertyForm: NgForm): void {
    this.loadingService.show();

    if (updatePropertyForm.valid) {
      const listing: Listing = {
        id: this.propertyId,
        imageUrls: [
          'https://picsum.photos/800/300?random=1',
          'https://picsum.photos/800/300?random=1',
        ],
        address: this.address,
        bedrooms: this.bedrooms,
        bathrooms: this.bathrooms,
        price: this.propertyPrice,
        parking: this.parking,
        furnished: this.furnished,
        name: this.propertyName,
        description: this.propertyDescription,
        userId: this.authService.getCurrentUser().id.toString(),
      };

      this.listingsService.updateProperty(listing).subscribe({
        next: (response) => {
          this.loadingService.hide();

          if (response && response.success) {
            this.messageService.showAlert(
              'Property updated successfully.',
              'success'
            );
            this.router.navigate(['/propertyDetails', this.propertyId]);
          } else {
            this.messageService.showAlert(
              'Error updating property. Please try again.',
              'error'
            );
          }
        },
        error: (response) => {
          this.loadingService.hide();

          if (response && response.success) {
            this.messageService.showAlert(
              'Property updated successfully.',
              'success'
            );
            this.router.navigate(['/propertyDetails', this.propertyId]);
          } else {
            this.messageService.showAlert(
              'Error updating property. Please try again.',
              'error'
            );
          }
        },
      });
    } else {
      this.messageService.showAlert(
        'Invalid property details. Please check your inputs and try again.',
        'error'
      );
    }
  }
}
