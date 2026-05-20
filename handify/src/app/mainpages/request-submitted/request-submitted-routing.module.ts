import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestSubmittedPage } from './request-submitted.page';

const routes: Routes = [
  {
    path: '',
    component: RequestSubmittedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestSubmittedPageRoutingModule {}
