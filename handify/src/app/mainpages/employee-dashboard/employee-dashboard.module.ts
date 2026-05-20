import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmployeeDashboardPage } from './employee-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: EmployeeDashboardPage }])
  ],
  declarations: [EmployeeDashboardPage]
})
export class EmployeeDashboardPageModule {}
