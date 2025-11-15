import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROLES } from '../../core/constants';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <mat-card>
      <h2>Inscription</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <div class="grid">
          <mat-form-field appearance="outline"><mat-label>Prénom</mat-label><input matInput formControlName="firstname" required /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Nom</mat-label><input matInput formControlName="lastname" required /></mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full"><mat-label>Email</mat-label><input matInput type="email" formControlName="email" required /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Mot de passe</mat-label><input matInput type="password" formControlName="password" required /></mat-form-field>
        <div class="grid">
          <mat-form-field appearance="outline"><mat-label>Rôle</mat-label>
            <mat-select formControlName="role">
              <mat-option value="ROLE_TENANT">Locataire</mat-option>
              <mat-option value="ROLE_OWNER">Propriétaire</mat-option>
              <mat-option value="ROLE_ADMIN">Admin</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Adresse de portefeuille (optionnel)</mat-label><input matInput formControlName="walletAddress" /></mat-form-field>
        </div>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">Créer un compte</button>
      </form>
    </mat-card>
  `,
  styles: [`.full{width:100%}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:640px){.grid{grid-template-columns:1fr}}`]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);
  loading = false;
  roles = ROLES;

  form = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['ROLE_TENANT'],
    walletAddress: ['']
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: () => { this.notify.success('Compte créé'); this.router.navigate(['/']); },
      error: (e) => { console.error(e); this.notify.error('Échec de l\'inscription'); this.loading=false; },
      complete: () => this.loading = false
    });
  }
}

