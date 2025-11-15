import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_LABELS } from '../../core/constants';
import { AsyncPipe, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, AsyncPipe, NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" routerLinkActive="active" class="logo" style="text-decoration:none;color:inherit"><span>RealEstate</span></a>
      <span class="spacer"></span>

      <ng-container *ngIf="(auth.currentUser$ | async) as user; else guest">
        <ng-container [ngSwitch]="user.role">
          <ng-container *ngSwitchCase="'ROLE_TENANT'">
            <a mat-button routerLink="/me/rentals" routerLinkActive="active">Mes locations</a>
          </ng-container>
          <ng-container *ngSwitchDefault>
            <a mat-button routerLink="/me/properties" routerLinkActive="active">Mes biens</a>
          </ng-container>
        </ng-container>
        <a mat-button routerLink="/profile" routerLinkActive="active">Profil</a>
        <span class="user">{{ user.email }} ({{ roleLabel(user.role) }})</span>
        <button mat-button (click)="logout()">Se déconnecter</button>
      </ng-container>
      <ng-template #guest>
        <a mat-button routerLink="/login" routerLinkActive="active">Connexion</a>
        <a mat-button routerLink="/register" routerLinkActive="active">Inscription</a>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .user { margin: 0 8px; font-size: .9rem; opacity: .9 }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  roleLabel(role: 'ROLE_TENANT'|'ROLE_OWNER'|'ROLE_ADMIN') { return ROLE_LABELS[role]; }
  logout() { this.auth.logout(); }
}
