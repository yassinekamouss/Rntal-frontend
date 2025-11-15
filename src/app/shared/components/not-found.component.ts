import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatCardModule, RouterLink, MatButtonModule],
  template: `
    <mat-card>
      <h2>Page introuvable</h2>
      <p>La page demandée n'existe pas.</p>
      <a mat-button color="primary" routerLink="/">Revenir à l'accueil</a>
    </mat-card>
  `
})
export class NotFoundComponent {}

