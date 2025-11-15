import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PropertyRequestDTO, PropertyResponseDTO } from '../models/dtos';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private base = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient) {}

  list(status?: 'AVAILABLE'|'RENTED'|'PENDING_VALIDATION', q?: string): Observable<PropertyResponseDTO[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (q) params = params.set('q', q);
    return this.http.get<PropertyResponseDTO[]>(`${this.base}/properties`, { params });
  }

  getById(id: number): Observable<PropertyResponseDTO> {
    return this.http.get<PropertyResponseDTO>(`${this.base}/properties/${id}`);
  }

  listMine(): Observable<PropertyResponseDTO[]> {
    return this.http.get<PropertyResponseDTO[]>(`${this.base}/properties/my`);
  }

  create(payload: PropertyRequestDTO): Observable<PropertyResponseDTO> {
    return this.http.post<PropertyResponseDTO>(`${this.base}/properties`, payload);
  }

  update(id: number, payload: PropertyRequestDTO): Observable<PropertyResponseDTO> {
    return this.http.put<PropertyResponseDTO>(`${this.base}/properties/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/properties/${id}`);
  }
}

