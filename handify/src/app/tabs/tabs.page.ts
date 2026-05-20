import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false
})
export class TabsPage implements OnInit {
  selectedTab: string = 'tab1'; // Default selected tab
  
  constructor() { }

  ngOnInit() {
  }
  
  setSelectedTab(tabName: string) {
    this.selectedTab = tabName;
    
    // Call APIs when tab3 (Requests) is selected
    if (tabName === 'tab3') {
      console.log('Tab3 selected, triggering refresh...');
      // The refresh will be handled by ionViewWillEnter in the tab3 component
    }
  }
}