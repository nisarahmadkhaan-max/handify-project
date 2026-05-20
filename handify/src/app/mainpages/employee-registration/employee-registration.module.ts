import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeRegistrationPage } from './employee-registration.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmployeeRegistrationPage]
})
export class EmployeeRegistrationPageModule {}
