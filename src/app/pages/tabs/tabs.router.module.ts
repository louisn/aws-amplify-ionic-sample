import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { TenantPage } from '../tenant/tenant.page';
import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { ContactPage } from '../contact/contact.page';
import { AuthGuardService } from '../../services/auth-route-guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tenant',
        outlet: 'tenant',
        component: TenantPage
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'list',
        outlet: 'list',
        canActivate: [AuthGuardService]
      },
      {
        path: 'contact',
        outlet: 'contact',
        component: ContactPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(tenant:tenant)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
