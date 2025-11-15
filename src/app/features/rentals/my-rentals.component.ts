import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalService } from '../../core/services/rental.service';
import { RentalResponseDTO } from '../../core/models/dtos';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, RouterLink],
  template: `
    <mat-card>
      <h2>Mes locations</h2>
      <table mat-table [dataSource]="rentals()" class="mat-elevation-z1" *ngIf="rentals().length; else empty">
        <ng-container matColumnDef="property">
          <th mat-header-cell *matHeaderCellDef> Bien </th>
          <td mat-cell *matCellDef="let r"> <a [routerLink]="['/properties', r.property.id]">{{ r.property.title }}</a> </td>
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
        <div style="padding:12px">Aucune location.</div>
      </ng-template>
    </mat-card>
  `
})
export class MyRentalsComponent implements OnInit {
  private service = inject(RentalService);
  rentals = signal<RentalResponseDTO[]>([]);
  displayedColumns = ['property', 'dates', 'price', 'status'];

  ngOnInit() {
    this.service.listMine().subscribe({ next: (list) => this.rentals.set(list), error: (e) => console.error(e) });
  }
}

