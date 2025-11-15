import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RentalRequestDTO, RentalResponseDTO } from '../models/dtos';

@Injectable({ providedIn: 'root' })
export class RentalService {
  private base = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient) {}

  create(payload: RentalRequestDTO): Observable<RentalResponseDTO> {
    return this.http.post<RentalResponseDTO>(`${this.base}/rentals`, payload);
    }

  listMine(): Observable<RentalResponseDTO[]> {
    return this.http.get<RentalResponseDTO[]>(`${this.base}/rentals/my-rentals`);
  }

  listForProperty(propertyId: number): Observable<RentalResponseDTO[]> {
    return this.http.get<RentalResponseDTO[]>(`${this.base}/rentals/property/${propertyId}`);
  }
}

