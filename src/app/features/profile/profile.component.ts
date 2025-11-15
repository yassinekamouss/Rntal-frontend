import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card *ngIf="auth.currentUser$ | async as user">
      <h2>Profil</h2>
      <p><strong>Nom:</strong> {{ user.firstname }} {{ user.lastname }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Rôle:</strong> {{ user.role }}</p>
      <p *ngIf="user.walletAddress"><strong>Wallet:</strong> {{ user.walletAddress }}</p>
    </mat-card>
  `
})
export class ProfileComponent {
  auth = inject(AuthService);
}

