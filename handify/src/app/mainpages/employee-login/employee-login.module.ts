import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmployeeLoginPage } from './employee-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: EmployeeLoginPage }])
  ],
  declarations: [EmployeeLoginPage]
})
export class EmployeeLoginPageModule {}
