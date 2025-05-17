import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AddPropertyComponent } from './pages/add-property/add-property.component';
import { PropertyDetailsComponent } from './pages/property-details/property-details.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { AuthGuard } from './auth.guard';
import { UpdatePropertyComponent } from './pages/update-property/update-property.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'addProperty',
    component: AddPropertyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'propertyDetails/:id',
    component: PropertyDetailsComponent,
  },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent },
  {
    path: 'update-property/:id',
    component: UpdatePropertyComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
