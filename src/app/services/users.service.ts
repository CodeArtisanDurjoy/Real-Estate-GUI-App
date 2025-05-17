import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Listing } from '../models/listing';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/apiResponse'; // Import ApiResponse model

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = environment.apiBaseUrl + '/api/users';

  constructor(private http: HttpClient) {}

  getUserProperties(userId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/listings/${userId}`);
  }

  deleteUser(userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/delete/${userId}`, {
      withCredentials: true,
    });
  }

  updateUser(
    id: number,
    username: string,
    email: string
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/update/${id}`,
      { username: username, email: email },
      {
        withCredentials: true,
      }
    );
  }

  getUser(userId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/${userId}`, {
      withCredentials: true,
    });
  }
}
