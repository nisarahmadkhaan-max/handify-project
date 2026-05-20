import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactSupportPage } from './contact-support.page';

const routes: Routes = [
  {
    path: '',
    component: ContactSupportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactSupportPageRoutingModule {}
