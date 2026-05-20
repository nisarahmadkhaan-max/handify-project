import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicepagePageRoutingModule } from './servicepage-routing.module';

import { ServicepagePage } from './servicepage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicepagePageRoutingModule
  ],
  declarations: [ServicepagePage]
})
export class ServicepagePageModule {}
