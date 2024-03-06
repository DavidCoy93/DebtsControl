import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DebtsComponent } from './pages/debts/debts.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DebtStatusPipe } from './pipes/debt-status.pipe';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogDebtComponent } from './components/dialog-debt/dialog-debt.component';
import { DialogDebtDetailComponent } from './components/dialog-debt-detail/dialog-debt-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DebtsFilterPipe } from './pipes/debts-filter.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DebtDetailsPipe } from './pipes/debt-details.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    DashboardComponent,
    DebtsComponent,
    DebtStatusPipe,
    DialogDebtComponent,
    DialogDebtDetailComponent,
    DebtsFilterPipe,
    DebtDetailsPipe,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatExpansionModule,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }
  ]
})
export class HomeModule { }