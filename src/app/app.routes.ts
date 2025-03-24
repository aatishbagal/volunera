import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './component_files/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'join-volunteer', component: NotFoundComponent },
  { path: 'register-ngo', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
  { path: 'not-found', component: NotFoundComponent }
];