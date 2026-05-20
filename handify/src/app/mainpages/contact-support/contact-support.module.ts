import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactSupportPageRoutingModule } from './contact-support-routing.module';

import { ContactSupportPage } from './contact-support.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactSupportPageRoutingModule
  ],
  declarations: [ContactSupportPage]
})
export class ContactSupportPageModule {}
