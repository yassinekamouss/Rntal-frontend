import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [MatCardModule, RouterLink, MatButtonModule],
  template: `
    <mat-card>
      <h2>Accès refusé</h2>
      <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      <a mat-button color="primary" routerLink="/">Revenir à l'accueil</a>
    </mat-card>
  `
})
export class AccessDeniedComponent {}

