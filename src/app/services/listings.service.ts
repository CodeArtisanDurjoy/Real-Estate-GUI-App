import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Listing } from '../models/listing';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class ListingsService {
  private listingsSubject = new BehaviorSubject<Listing[]>([]);
  listings$: Observable<Listing[]> = this.listingsSubject.asObservable();

  private baseUrl = environment.apiBaseUrl + '/api/listings';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.loadListings();
  }

  private _listings: Listing[] = [];

  get listing(): Listing[] {
    return this._listings;
  }

  addProperty(listing: Listing): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/create`, listing, {
      withCredentials: true,
    });
  }

  deleteProperty(propertyId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/delete/${propertyId}`,
      {
        withCredentials: true,
      }
    );
  }

  updateProperty(updatedListing: Listing): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/update/${updatedListing.id}`,
      updatedListing,
      {
        withCredentials: true,
      }
    );
  }

  getProperty(propertyId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/get/${propertyId}`);
  }

  getProperties(filter: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/get?${filter}`);
  }

  loadListings(): void {
    this.getProperties('searchTerm=&limit=3').subscribe({
      next: (response) => {
        if (response && response.success) {
          this._listings = response.listings;

          this.listingsSubject.next([...this._listings]);
        } else {
          this.messageService.showAlert(
            `Error fetching listings: ${response.message}`,
            'error'
          );
        }
      },
      error: (response) => {
        if (response && response.success) {
          this._listings = response.listings;

          this.listingsSubject.next([...this._listings]);
        } else {
          this.messageService.showAlert(
            `Error fetching listings: ${response.message}`,
            'error'
          );
        }
      },
    });
  }
}
