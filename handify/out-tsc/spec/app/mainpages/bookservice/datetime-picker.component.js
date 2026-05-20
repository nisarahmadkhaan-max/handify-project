import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
let DatetimePickerComponent = class DatetimePickerComponent {
    onDateTimeChange(event) {
        this.popoverController.dismiss(event.detail.value);
    }
    constructor(popoverController) {
        this.popoverController = popoverController;
        this.presentation = 'date';
    }
};
__decorate([
    Input()
], DatetimePickerComponent.prototype, "presentation", void 0);
__decorate([
    Input()
], DatetimePickerComponent.prototype, "min", void 0);
__decorate([
    Input()
], DatetimePickerComponent.prototype, "max", void 0);
__decorate([
    Input()
], DatetimePickerComponent.prototype, "hourCycle", void 0);
DatetimePickerComponent = __decorate([
    Component({
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
], DatetimePickerComponent);
export { DatetimePickerComponent };
//# sourceMappingURL=datetime-picker.component.js.map