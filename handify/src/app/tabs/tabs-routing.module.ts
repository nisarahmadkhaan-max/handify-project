import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { TabsPage } from "./tabs.page"

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        loadChildren: () => import("../tab1/tab1.module").then((m) => m.Tab1PageModule),
      },
      {
        path: "tab2",
        loadChildren: () => import("../tab2/tab2.module").then((m) => m.Tab2PageModule),
      },
      {
        path: "tab3",
        loadChildren: () => import("../tab3/tab3.module").then((m) => m.Tab3PageModule),
      },{
        path: "tab4",
        loadChildren: () => import("../tab4/tab4.module").then((m) => m.Tab4PageModule),
      },{
        path: "tab5",
        loadChildren: () => import("../tab3/tab3.module").then((m) => m.Tab3PageModule),
      },
      {
        path: 'servicepage',
        loadChildren: () => import('../mainpages/servicepage/servicepage.module').then(m => m.ServicepagePageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../mainpages/notification/notification.module').then(m => m.NotificationPageModule)
      },
      {
        path: 'contact-support',
        loadChildren: () => import('../mainpages/contact-support/contact-support.module').then(m => m.ContactSupportPageModule)
      },
      {
        path: 'service-history',
        loadChildren: () => import('../mainpages/service-history/service-history.module').then(m => m.ServiceHistoryPageModule)
      },
      {
        path: 'request-details/:id',
        loadChildren: () => import('../mainpages/request-details/request-details.module').then(m => m.RequestDetailsPageModule)
      },
      {
        path: "",
        redirectTo: "/tabs/tab1",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/tab1",
    pathMatch: "full",
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}

