import { Routes } from '@angular/router';

import { AdminLayout } from './layout/admin-layout/admin-layout';

import { Dashboard } from './pages/dashboard/dashboard';
import { AdmComponent } from './pages/admission/admission';
import { Alumni } from './pages/alumni/alumni';
import { EventsComponent } from './pages/events/events';
import { ExiadmComponent } from './pages/results/results';
import { GalleryComponent } from './pages/gallery/gallery';
import { GalleryDetails } from './pages/gallery-details/gallery-details';
import { UpdateEventComponent } from './pages/update-event/update-event';
import { TeacherComponent } from './pages/staff/teacher';
import { UpdateStaffComponent } from './pages/update-staff/update-teacher';
import { TeacherDetails } from './pages/staff-details/teacher-details';
import { AddStaffComponent } from './pages/add-staff/add-staff';
import { AdmsignComponent } from './pages/admsign/admsign';
import { NewadmComponent } from './pages/newadm/newadm';

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
        component: AdmComponent
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
        component: ExiadmComponent
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
        path: 'staff-details/:id',
        component: TeacherDetails
      },
      {
        path: 'add-staff',
        component: AddStaffComponent
      },
      {
        path: 'update-staff/:id',
        component: UpdateStaffComponent
      }
    ]
  },
  {
    path: 'admsign',
    component: AdmsignComponent
  },
  {
    path: 'newadm',
    component: NewadmComponent
  },
  {
    path: 'admret',
    component: AdmComponent
  }
];