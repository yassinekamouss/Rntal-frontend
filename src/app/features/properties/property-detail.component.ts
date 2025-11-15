import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { PropertyResponseDTO } from '../../core/models/dtos';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RentalService } from '../../core/services/rental.service';
import { NotificationService } from '../../shared/services/notification.service';

function dateOnlyIso(d: Date): string { return d.toISOString().substring(0,10); }
function addDays(d: Date, days: number): Date { const x = new Date(d); x.setDate(x.getDate()+days); return x; }
function startOfDay(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

@Component({
  standalone: true,
  selector: 'app-property-detail',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatDividerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <ng-container *ngIf="property(); else loadingTpl">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ property()!.title }}</mat-card-title>
          <mat-card-subtitle>{{ property()!.address }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="gallery">
            <img *ngFor="let img of property()!.images" [src]="img.url" alt="image" />
          </div>
          <p>{{ property()!.description }}</p>
          <div class="meta">
            <span><strong>{{ property()!.pricePerNight | number:'1.0-2' }} €</strong> / nuit</span>
            <span class="status">Statut: {{ property()!.status }}</span>
          </div>
          <div class="map">Carte: ({{ property()!.latitude }}, {{ property()!.longitude }})</div>
        </mat-card-content>
      </mat-card>

      <section *ngIf="canBook()" class="book">
        <h3>Réserver</h3>
        <form [formGroup]="form" (ngSubmit)="submit()" class="book-form">
          <mat-form-field appearance="outline">
            <mat-label>Date de début</mat-label>
            <input matInput [matDatepicker]="dp1" formControlName="startDate" required />
            <mat-datepicker-toggle matIconSuffix [for]="dp1"></mat-datepicker-toggle>
            <mat-datepicker #dp1></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Date de fin</mat-label>
            <input matInput [matDatepicker]="dp2" formControlName="endDate" required />
            <mat-datepicker-toggle matIconSuffix [for]="dp2"></mat-datepicker-toggle>
            <mat-datepicker #dp2></mat-datepicker>
          </mat-form-field>
          <div class="price" *ngIf="nights() > 0">
            {{ nights() }} nuit(s) x {{ property()!.pricePerNight | number:'1.0-2' }} € =
            <strong>{{ totalPrice() | number:'1.0-2' }} €</strong>
          </div>
          <div class="error" *ngIf="errorMsg()">{{ errorMsg() }}</div>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting || nights() <= 0">Réserver</button>
        </form>
      </section>
    </ng-container>
    <ng-template #loadingTpl>
      <div style="text-align:center;padding:24px">Chargement...</div>
    </ng-template>
  `,
  styles: [`.gallery{display:flex;gap:8px;overflow:auto;margin-bottom:8px}.gallery img{height:160px;border-radius:4px;object-fit:cover}.meta{display:flex;gap:16px;align-items:center;margin:8px 0}.map{background:#f5f5f5;padding:12px;border-radius:4px}.book{margin-top:16px}.book-form{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.price{margin:0 12px}.error{color:#c62828}`]
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propService = inject(PropertyService);
  private auth = inject(AuthService);
  private rentals = inject(RentalService);
  private notify = inject(NotificationService);

  property = signal<PropertyResponseDTO | null>(null);
  form = inject(FormBuilder).group({
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required]
  });
  submitting = false;
  errorMsg = signal<string>('');

  canBook = computed(() => {
    const user = (this.auth as any)['currentUserSubject']?.value;
    return user && user.role === 'ROLE_TENANT' && this.property()?.status === 'AVAILABLE';
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.propService.getById(id).subscribe({
      next: (p) => this.property.set(p),
      error: (e) => { console.error(e); this.notify.error('Erreur lors du chargement'); }
    });

    this.form.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  nights() {
    const { startDate, endDate } = this.form.value;
    if (!startDate || !endDate) return 0;
    const s = startOfDay(startDate as Date).getTime();
    const e = startOfDay(endDate as Date).getTime();
    const diff = (e - s) / (1000*60*60*24);
    return diff > 0 ? diff : 0;
  }

  totalPrice() {
    return this.nights() * (this.property()?.pricePerNight || 0);
  }

  validateDates() {
    const today = startOfDay(new Date());
    const s = this.form.controls.startDate.value as Date | null;
    const e = this.form.controls.endDate.value as Date | null;
    this.errorMsg.set('');
    if (s && s < today) {
      this.errorMsg.set('La date de début doit être aujourd\'hui ou plus tard.');
      return false;
    }
    if (s && e && e < addDays(s, 1)) {
      this.errorMsg.set('La date de fin doit être au moins le lendemain de la date de début.');
      return false;
    }
    return true;
  }

  submit() {
    if (!this.property()) return;
    if (!this.validateDates()) return;
    const { startDate, endDate } = this.form.value;
    const payload = {
      propertyId: this.property()!.id,
      startDate: dateOnlyIso(startDate as Date),
      endDate: dateOnlyIso(endDate as Date)
    } as const;
    this.submitting = true;
    this.errorMsg.set('');
    this.rentals.create(payload).subscribe({
      next: () => { this.notify.success('Réservation créée'); },
      error: (e) => {
        console.error(e);
        const msg = e?.error?.message || 'Impossible de créer la réservation';
        this.errorMsg.set(msg);
        this.submitting = false;
      },
      complete: () => this.submitting = false
    });
  }
}
