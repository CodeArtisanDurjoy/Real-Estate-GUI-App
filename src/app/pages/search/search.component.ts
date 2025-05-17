import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ListingsService } from '../../services/listings.service';
import { Listing } from '../../models/listing';
import { MessageService } from '../../services/message.service';
import { LoadingService } from '../../services/loading.service';
import { ApiResponse } from '../../models/apiResponse';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  searchTerm = '';
  parking = false;
  furnished = false;
  sortOptions = 'createdAt_desc';
  sort = '';
  order = '';
  showMoreBtn = false;
  startIndex = 0;
  limit = 9;

  listings: Listing[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private listingService: ListingsService,
    private messageService: MessageService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.queryParamMap.subscribe((queryParams) => {
      this.searchTerm = queryParams.get('searchTerm') || '';
      this.furnished = queryParams.get('furnished') === 'true' ? true : false;
      this.parking = queryParams.get('parking') === 'true' ? true : false;
      const sortParam = queryParams.get('sort');
      const orderParam = queryParams.get('order');
      const limitParam = queryParams.get('limit');
      this.limit = limitParam ? parseInt(limitParam, 10) : 9;

      if (sortParam && orderParam) {
        this.sortOptions = `${sortParam}_${orderParam}`;
      }

      const queryParamsString = queryParams.keys
        .map((key) => `${key}=${queryParams.getAll(key).join(',')}`)
        .join('&');

      this.fetchProperties(queryParamsString);
    });
  }

  onSearchSubmit(profileForm: NgForm): void {
    if (profileForm.valid) {
      if (this.sortOptions.startsWith('price')) {
        this.sort = 'price';
        this.order = this.sortOptions.endsWith('desc') ? 'desc' : 'asc';
      } else if (this.sortOptions.startsWith('createdAt')) {
        this.sort = 'createdAt';
        this.order = this.sortOptions.endsWith('desc') ? 'desc' : 'asc';
      } else {
        this.messageService.showAlert('Invalid sort option', 'error');
      }
      this.router.navigate(['/search'], {
        queryParams: {
          searchTerm: this.searchTerm,
          parking: this.parking || 'false',
          furnished: this.furnished || 'false',
          sort: this.sort || 'createdAt',
          order: this.order || 'desc',
        },
      });
    } else {
      this.messageService.showAlert(
        'Invalid search criteria. Please check your inputs and try again.',
        'error'
      );
    }
  }

  onShowMoreClick() {
    const queryParams = this.route.snapshot.queryParamMap;

    let queryParamsString = Array.from(queryParams.keys)
      .map((key) => {
        if (key === 'limit') {
          return ''; // Skip this iteration
        }
        return `${key}=${queryParams.getAll(key).join(',')}`;
      })
      .join('&');

    queryParamsString =
      queryParamsString + `&startIndex=${this.startIndex}&limit=${this.limit}`;

    console.log('query params string is :', queryParamsString);

    this.fetchProperties(queryParamsString);
  }

  fetchProperties(queryParamsString: string) {
    this.loadingService.show();

    this.listingService.getProperties(queryParamsString).subscribe({
      next: (response) => {
        this.handleFetchResponse(response);
      },
      error: (response) => {
        this.handleFetchResponse(response);
      },
    });
  }

  private handleFetchResponse(response: ApiResponse) {
    this.loadingService.hide();

    if (response && response.success) {
      if (response.listings) {
        this.listings.push(...response.listings);

        this.showMoreBtn = response.listings.length === this.limit;
        this.startIndex = this.listings.length;
      }
    } else {
      this.messageService.showAlert(
        'Error fetching listings. Please try again.',
        'error'
      );
    }
  }
}
