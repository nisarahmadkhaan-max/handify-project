import { __decorate } from "tslib";
import { Component } from '@angular/core';
let TabsPage = class TabsPage {
    constructor() {
        this.selectedTab = 'tab1'; // Default selected tab
    }
    ngOnInit() {
    }
    setSelectedTab(tabName) {
        this.selectedTab = tabName;
    }
};
TabsPage = __decorate([
    Component({
        selector: 'app-tabs',
        templateUrl: './tabs.page.html',
        styleUrls: ['./tabs.page.scss'],
        standalone: false
    })
], TabsPage);
export { TabsPage };
//# sourceMappingURL=tabs.page.js.map