import { Routes } from '@angular/router';

import { AdminLayout } from './layout/admin-layout/admin-layout';

import { Dashboard } from './pages/dashboard/dashboard';
import { Admission } from './pages/admission/admission';
import { Alumni } from './pages/alumni/alumni';
import { EventsComponent } from './pages/events/events';
import { Results } from './pages/results/results';
import { GalleryComponent } from './pages/gallery/gallery';
import { GalleryDetails } from './pages/gallery-details/gallery-details';
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
        component: EventsComponent
      },
      {
        path: 'alumni',
        component: Alumni
      },
      {
        path: 'results',
        component: Results
      },
      {
        path: 'gallery',
        component: GalleryComponent
      },

      {
        path: 'gallery/:id',
        component: GalleryDetails
      },
      
    ]
  }
];