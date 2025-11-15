import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../core/services/property.service';
import { PropertyResponseDTO } from '../../core/models/dtos';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatDialogModule],
  template: `
    <div class="header">
      <h2>Mes biens</h2>
      <a mat-raised-button color="primary" routerLink="/me/properties/new">Nouveau bien</a>
    </div>

    <table mat-table [dataSource]="items()" class="mat-elevation-z1" *ngIf="items().length; else empty">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef> Titre </th>
        <td mat-cell *matCellDef="let p"> {{ p.title }} </td>
      </ng-container>
      <ng-container matColumnDef="address">
        <th mat-header-cell *matHeaderCellDef> Adresse </th>
        <td mat-cell *matCellDef="let p"> {{ p.address }} </td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef> Prix / nuit </th>
        <td mat-cell *matCellDef="let p"> {{ p.pricePerNight | number:'1.0-2' }} € </td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef> Statut </th>
        <td mat-cell *matCellDef="let p"> {{ p.status }} </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let p">
          <a mat-button color="primary" [routerLink]="['/me/properties', p.id, 'edit']">Éditer</a>
          <a mat-button [routerLink]="['/me/properties', p.id, 'rentals']">Réservations</a>
          <button mat-button color="warn" (click)="confirmDelete(p)">Supprimer</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <ng-template #empty>
      <div style="padding:12px">Aucun bien.</div>
    </ng-template>
  `,
  styles: [`.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}`]
})
export class MyPropertiesComponent implements OnInit {
  private service = inject(PropertyService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  items = signal<PropertyResponseDTO[]>([]);
  displayedColumns = ['title','address','price','status','actions'];

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.service.listMine().subscribe({ next: (list) => this.items.set(list), error: (e) => console.error(e) });
  }

  confirmDelete(p: PropertyResponseDTO) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Supprimer', message: `Supprimer le bien "${p.title}" ?` } })
      .afterClosed().subscribe((ok) => {
        if (ok) this.delete(p.id);
      });
  }

  delete(id: number) {
    this.service.remove(id).subscribe({
      next: () => { this.notify.success('Bien supprimé'); this.refresh(); },
      error: (e) => { console.error(e); this.notify.error('Échec de suppression'); }
    });
  }
}

