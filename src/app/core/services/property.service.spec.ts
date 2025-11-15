import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { environment } from '../../../environments/environment';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should list properties with filters', () => {
    service.list('AVAILABLE', 'paris').subscribe((res) => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.apiBaseUrl}/properties`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('AVAILABLE');
    expect(req.request.params.get('q')).toBe('paris');

    req.flush([{ id: 1, title: 't', description: 'd', address: 'a', latitude: 0, longitude: 0, pricePerNight: 1, status: 'AVAILABLE', owner: { id: 1, firstname: 'f', lastname: 'l', email: 'e', role: 'ROLE_OWNER' }, images: [] }]);
  });
});

