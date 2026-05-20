import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestSubmittedPageRoutingModule } from './request-submitted-routing.module';

import { RequestSubmittedPage } from './request-submitted.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestSubmittedPageRoutingModule
  ],
  declarations: [RequestSubmittedPage]
})
export class RequestSubmittedPageModule {}
