import { Routes } from '@angular/router';

import { AdminLayout } from './layout/admin-layout/admin-layout';

import { Dashboard } from './pages/dashboard/dashboard';
import { Admission } from './pages/admission/admission';
import { Alumni } from './pages/alumni/alumni';
import { EventsComponent } from './pages/events/events';
import { Results } from './pages/results/results';
import { GalleryComponent } from './pages/gallery/gallery';
import { GalleryDetails } from './pages/gallery-details/gallery-details';
import { UpdateEventComponent } from './pages/update-event/update-event';
import { TeacherComponent } from './pages/staff/teacher';
import { UpdateTeacher } from './pages/update-staff/update-teacher';
import { TeacherDetails } from './pages/staff-details/teacher-details';
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
      {
        path: 'update-event/:id',
        component: UpdateEventComponent
      },
      {
        path: 'staff',
        component: TeacherComponent
      },
      {
        path: 'add-staff',
        component: UpdateTeacher
      },
      {
        path: 'update-staff/:id',
        component: UpdateTeacher
      },
      {
        path: 'staff-details/:id',
        component: TeacherDetails
      },
    ]
  }
];