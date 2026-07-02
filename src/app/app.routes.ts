import { Routes } from '@angular/router';

import { AdminLayout } from './layout/admin-layout/admin-layout';

import { Dashboard } from './pages/dashboard/dashboard';
import { Admission } from './pages/admission/admission';
import { Alumni } from './pages/alumni/alumni';
import { Events } from './pages/events/events';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'admission',
        component: Admission
      },
      {
        path: 'events',
        component: Events
      },
      {
        path: 'alumni',
        component: Alumni
      }
    ]
  }
];