import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snack: MatSnackBar) {}

  success(message: string) {
    this.snack.open(message, 'OK', { duration: 3000, panelClass: ['snack-success'] });
  }

  error(message: string) {
    this.snack.open(message, 'Fermer', { duration: 5000, panelClass: ['snack-error'] });
  }

  warn(message: string) {
    this.snack.open(message, 'Fermer', { duration: 4000, panelClass: ['snack-warn'] });
  }
}

