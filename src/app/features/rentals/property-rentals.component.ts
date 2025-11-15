import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../../core/services/rental.service';
import { RentalResponseDTO } from '../../core/models/dtos';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-property-rentals',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Réservations du bien</h2>
      <table mat-table [dataSource]="items()" class="mat-elevation-z1" *ngIf="items().length; else empty">
        <ng-container matColumnDef="renter">
          <th mat-header-cell *matHeaderCellDef> Locataire </th>
          <td mat-cell *matCellDef="let r"> {{ r.renter.email }} </td>
        </ng-container>
        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef> Dates </th>
          <td mat-cell *matCellDef="let r"> {{ r.startDate }} → {{ r.endDate }} </td>
        </ng-container>
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef> Prix total </th>
          <td mat-cell *matCellDef="let r"> {{ r.totalPrice | number:'1.0-2' }} € </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let r"> {{ r.status }} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <ng-template #empty>
        <div style="padding:12px">Aucune réservation.</div>
      </ng-template>
    </mat-card>
  `
})
export class PropertyRentalsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(RentalService);
  items = signal<RentalResponseDTO[]>([]);
  displayedColumns = ['renter', 'dates', 'price', 'status'];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.service.listForProperty(id).subscribe({ next: (list) => this.items.set(list), error: (e) => console.error(e) });
  }
}
