import { Component, Input } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datetime-picker',
  template: `
    <ion-datetime
      [presentation]="presentation"
      [min]="min"
      [max]="max"
      [hourCycle]="hourCycle"
      (ionChange)="onDateTimeChange($event)"
    ></ion-datetime>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DatetimePickerComponent {
  @Input() presentation: 'date' | 'time' = 'date';
  @Input() min?: string;
  @Input() max?: string;
  @Input() hourCycle?: 'h12' | 'h23';

  onDateTimeChange(event: any) {
    this.popoverController.dismiss(event.detail.value);
  }

  constructor(private popoverController: PopoverController) {}
} 