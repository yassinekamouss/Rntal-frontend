import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { PropertyResponseDTO } from '../../core/models/dtos';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card>
      <h2>{{ isEdit() ? 'Éditer le bien' : 'Nouveau bien' }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <mat-form-field appearance="outline" class="full"><mat-label>Titre</mat-label><input matInput formControlName="title" required /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="4" required></textarea></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Adresse</mat-label><input matInput formControlName="address" required /></mat-form-field>
        <div class="grid">
          <mat-form-field appearance="outline"><mat-label>Latitude</mat-label><input matInput type="number" formControlName="latitude" required /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Longitude</mat-label><input matInput type="number" formControlName="longitude" required /></mat-form-field>
        </div>
        <mat-form-field appearance="outline"><mat-label>Prix par nuit (€)</mat-label><input matInput type="number" formControlName="pricePerNight" required /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>URLs d'images (une par ligne)</mat-label><textarea matInput formControlName="imageUrlsText" rows="4"></textarea></mat-form-field>
        <div style="margin-top:12px; display:flex; gap:8px">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">{{ isEdit() ? 'Mettre à jour' : 'Créer' }}</button>
          <a mat-button routerLink="/me/properties">Annuler</a>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`.full{width:100%}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:640px){.grid{grid-template-columns:1fr}}`]
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(PropertyService);
  private notify = inject(NotificationService);

  id = signal<number | null>(null);
  loading = false;

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    address: ['', Validators.required],
    latitude: [0, Validators.required],
    longitude: [0, Validators.required],
    pricePerNight: [0, [Validators.required, Validators.min(0)]],
    imageUrlsText: ['']
  });

  isEdit() { return this.id() !== null; }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.service.getById(id).subscribe({
        next: (p: PropertyResponseDTO) => {
          this.form.patchValue({
            title: p.title,
            description: p.description,
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            pricePerNight: p.pricePerNight,
            imageUrlsText: (p.images || []).map(i => i.url).join('\n')
          });
        },
        error: (e) => { console.error(e); this.notify.error('Erreur de chargement du bien'); }
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const v = this.form.value as any;
    const payload = {
      title: v.title,
      description: v.description,
      address: v.address,
      latitude: Number(v.latitude),
      longitude: Number(v.longitude),
      pricePerNight: Number(v.pricePerNight),
      imageUrls: (v.imageUrlsText as string).split(/\n|\r/).map(s => s.trim()).filter(Boolean)
    };

    if (this.isEdit()) {
      this.service.update(this.id()!, payload).subscribe({
        next: () => { this.notify.success('Bien mis à jour'); this.router.navigate(['/me/properties']); },
        error: (e) => { console.error(e); this.notify.error('Échec de mise à jour'); this.loading=false; },
        complete: () => this.loading = false
      });
    } else {
      this.service.create(payload).subscribe({
        next: () => { this.notify.success('Bien créé (en validation)'); this.router.navigate(['/me/properties']); },
        error: (e) => { console.error(e); this.notify.error('Échec de création'); this.loading=false; },
        complete: () => this.loading = false
      });
    }
  }
}

