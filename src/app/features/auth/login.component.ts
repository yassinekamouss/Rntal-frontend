import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule],
  template: `
    <mat-card>
      <h2>Connexion</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Mot de passe</mat-label>
          <input matInput type="password" formControlName="password" required />
        </mat-form-field>
        <mat-checkbox formControlName="remember">Se souvenir de moi</mat-checkbox>
        <div style="margin-top:12px">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">Se connecter</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`.full{width:100%}`]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [true]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.setUseSession(!this.form.value.remember);
    const { email, password } = this.form.value as any;
    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.notify.success('Connecté');
        this.router.navigate(['/']);
      },
      error: (e) => {
        console.error(e);
        this.notify.error('Échec de connexion');
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}

