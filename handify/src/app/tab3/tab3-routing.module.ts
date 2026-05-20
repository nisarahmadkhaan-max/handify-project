import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page
  },
  {
    path: 'request-details/:id',
    loadChildren: () => import('../mainpages/request-details/request-details.module').then(m => m.RequestDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
