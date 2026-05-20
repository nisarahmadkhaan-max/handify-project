import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: () => import('./landingpages/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./landingpages/onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then(m => m.Tab4PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'servicepage',
    loadChildren: () => import('./mainpages/servicepage/servicepage.module').then(m => m.ServicepagePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookservice',
    loadChildren: () => import('./mainpages/bookservice/bookservice.module').then(m => m.BookservicePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookingconfirm',
    loadChildren: () => import('./mainpages/bookingconfirm/bookingconfirm.module').then(m => m.BookingconfirmPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./mainpages/notification/notification.module').then(m => m.NotificationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contact-support',
    loadChildren: () => import('./mainpages/contact-support/contact-support.module').then(m => m.ContactSupportPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'request-submitted',
    loadChildren: () => import('./mainpages/request-submitted/request-submitted.module').then(m => m.RequestSubmittedPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'live-chat',
    loadChildren: () => import('./mainpages/live-chat/live-chat.module').then(m => m.LiveChatPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'service-history',
    loadChildren: () => import('./mainpages/service-history/service-history.module').then(m => m.ServiceHistoryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./mainpages/settings/settings.module').then(m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'tutorials',
    loadChildren: () => import('./landingpages/tutorials/tutorials.module').then(m => m.TutorialsPageModule),
  },
  {
    path: 'request-details/:id',
    loadChildren: () => import('./mainpages/request-details/request-details.module').then(m => m.RequestDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee-registration',
    loadChildren: () => import('./mainpages/employee-registration/employee-registration.module').then(m => m.EmployeeRegistrationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee-auth',
    loadChildren: () => import('./mainpages/employee-auth/employee-auth.module').then(m => m.EmployeeAuthPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee-login',
    loadChildren: () => import('./mainpages/employee-login/employee-login.module').then(m => m.EmployeeLoginPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee-dashboard',
    loadChildren: () => import('./mainpages/employee-dashboard/employee-dashboard.module').then(m => m.EmployeeDashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'wallet-recharge',
    loadChildren: () => import('./mainpages/wallet-recharge/wallet-recharge.module').then(m => m.WalletRechargePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'splash'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
