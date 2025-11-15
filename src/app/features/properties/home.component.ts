import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { PROPERTY_STATUSES, STATUS_LABELS } from '../../core/constants';
import { PropertyResponseDTO } from '../../core/models/dtos';
import { debounceTime, switchMap, startWith } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
  template: `
    <section>
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select [formControl]="statusCtl">
            <mat-option [value]="null">Tous</mat-option>
            <mat-option *ngFor="let s of statuses" [value]="s">{{ statusLabel(s) }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="search">
          <mat-label>Recherche (adresse)</mat-label>
          <input matInput [formControl]="qCtl" placeholder="Paris..." />
        </mat-form-field>
      </div>

      <div *ngIf="loading()" class="center"><mat-progress-spinner mode="indeterminate"></mat-progress-spinner></div>
      <div *ngIf="!loading() && properties().length === 0" class="center">Aucun bien.</div>

      <div class="grid">
        <mat-card *ngFor="let p of properties()" class="card">
          <img *ngIf="p.images?.length" [src]="p.images[0].url" alt="image" class="thumb" />
          <mat-card-title>{{ p.title }}</mat-card-title>
          <mat-card-subtitle>{{ p.address }}</mat-card-subtitle>
          <mat-card-content>
            <div><strong>{{ p.pricePerNight | number:'1.0-2' }} €</strong> / nuit</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" [routerLink]="['/properties', p.id]">Détails</a>
          </mat-card-actions>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .filters { display:flex; gap:12px; align-items:center; margin-bottom: 16px; }
    .filters .search { flex: 1; }
    .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
    .card { display:flex; flex-direction:column }
    .thumb { width:100%; height:160px; object-fit:cover; }
    .center { text-align:center; padding: 24px; }
  `]
})
export class HomeComponent implements OnInit {
  private propService = inject(PropertyService);
  statuses = PROPERTY_STATUSES;
  properties = signal<PropertyResponseDTO[]>([]);
  loading = signal<boolean>(false);
  statusCtl = new FormControl<string | null>(null);
  qCtl = new FormControl<string>('');

  ngOnInit() {
    this.statusCtl.valueChanges.pipe(startWith(this.statusCtl.value), debounceTime(200)).subscribe(() => this.fetch());
    this.qCtl.valueChanges.pipe(startWith(this.qCtl.value), debounceTime(300)).subscribe(() => this.fetch());
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.propService.list(this.statusCtl.value as any || undefined, this.qCtl.value || undefined).subscribe({
      next: (list) => this.properties.set(list),
      error: (e) => console.error(e),
      complete: () => this.loading.set(false)
    });
  }

  statusLabel(s: 'AVAILABLE'|'RENTED'|'PENDING_VALIDATION') { return STATUS_LABELS[s]; }
}

