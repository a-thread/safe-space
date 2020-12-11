import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { AboutComponent } from './pages/about/about.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TableComponent } from './global/table/table.component';
import { ResourceFormComponent } from './pages/resource-form/resource-form.component';
import { StateTemplateComponent } from './pages/state-template/state-template.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirect to home page

  // Base Pages
  { path: 'about', component: AboutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'table', component: TableComponent, canActivate: [AuthGuard] },
  { path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
  { path: 'connect', component: ConnectComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'resources', component: TableComponent, data: { type: "All Resource", state: "all" } },

  // State Pages
  { path: 'nh', component: StateTemplateComponent, data: { stateTitle: "New Hampshire", stateName: "nh" }, canActivate: [AuthGuard] },
  { path: 'vt', component: StateTemplateComponent, data: { stateTitle: "Vermont", stateName: "vt" }, canActivate: [AuthGuard] },
  { path: 'ny', component: StateTemplateComponent, data: { stateTitle: "New York", stateName: "ny" }, canActivate: [AuthGuard] },
  { path: 'ma', component: StateTemplateComponent, data: { stateTitle: "Massachusetts", stateName: "ma" }, canActivate: [AuthGuard] },
  { path: 'me', component: StateTemplateComponent, data: { stateTitle: "Maine", stateName: "me" }, canActivate: [AuthGuard] },


  // Maine Resources
  { path: 'me-coffee-shop', component: TableComponent, data: { type: "coffee shop", state: "me" }, canActivate: [AuthGuard] },
  { path: 'me-restaurant', component: TableComponent, data: { type: "restaurant", state: "me" }, canActivate: [AuthGuard] },
  { path: 'me-resource', component: TableComponent, data: { type: "resource", state: "me" }, canActivate: [AuthGuard] },
  { path: 'me-misc', component: TableComponent, data: { type: "misc", state: "me" }, canActivate: [AuthGuard] },


  // Massachusettes Resources
  { path: 'ma-coffee-shop', component: TableComponent, data: { type: "coffee shop", state: "ma" }, canActivate: [AuthGuard] },
  { path: 'ma-restaurant', component: TableComponent, data: { type: "restaurant", state: "ma" }, canActivate: [AuthGuard] },
  { path: 'ma-resource', component: TableComponent, data: { type: "resource", state: "ma" }, canActivate: [AuthGuard] },
  { path: 'ma-misc', component: TableComponent, data: { type: "misc", state: "ma" }, canActivate: [AuthGuard] },


  // New York Resources
  { path: 'ny-coffee-shop', component: TableComponent, data: { type: "coffee shop", state: "ny" }, canActivate: [AuthGuard] },
  { path: 'ny-restaurant', component: TableComponent, data: { type: "restaurant", state: "ny" }, canActivate: [AuthGuard] },
  { path: 'ny-resource', component: TableComponent, data: { type: "resource", state: "ny" }, canActivate: [AuthGuard] },
  { path: 'ny-misc', component: TableComponent, data: { type: "misc", state: "ny" }, canActivate: [AuthGuard] },


  // New Hampshire Resources
  { path: 'nh-coffee-shop', component: TableComponent, data: { type: "coffee shop", state: "nh" }, canActivate: [AuthGuard] },
  { path: 'nh-restaurant', component: TableComponent, data: { type: "restaurant", state: "nh" }, canActivate: [AuthGuard] },
  { path: 'nh-resource', component: TableComponent, data: { type: "resource", state: "nh" }, canActivate: [AuthGuard] },
  { path: 'nh-misc', component: TableComponent, data: { type: "misc", state: "nh" }, canActivate: [AuthGuard] },



  // Vermont Resources
  { path: 'vt-coffee-shop', component: TableComponent, data: { type: "coffee shop", state: "vt" }, canActivate: [AuthGuard] },
  { path: 'vt-restaurant', component: TableComponent, data: { type: "restaurant", state: "vt" }, canActivate: [AuthGuard] },
  { path: 'vt-resource', component: TableComponent, data: { type: "resource", state: "vt" }, canActivate: [AuthGuard] },
  { path: 'vt-misc', component: TableComponent, data: { type: "misc", state: "vt" }, canActivate: [AuthGuard] },


  // Forms
  { path: 'addBusiness', component: ResourceFormComponent },
  { path: 'resourceform', component: ResourceFormComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
