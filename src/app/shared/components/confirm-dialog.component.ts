import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirmer' }}</h2>
    <div mat-dialog-content>
      <p>{{ data.message || 'Voulez-vous confirmer cette action ?' }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Annuler</button>
      <button mat-raised-button color="warn" (click)="close(true)">{{ data.confirmText || 'Supprimer' }}</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    private ref: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string; confirmText?: string }
  ) {}

  close(val: boolean) { this.ref.close(val); }
}

