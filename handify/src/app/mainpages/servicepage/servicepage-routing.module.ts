import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicepagePage } from './servicepage.page';

const routes: Routes = [
  {
    path: '',
    component: ServicepagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicepagePageRoutingModule {}
