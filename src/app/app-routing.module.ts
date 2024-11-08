import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { BookingFormComponent } from './booking-form/booking-form.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent },
      { path: 'hotel-list', component: HotelListComponent },
      { path: 'hotel-details/:id/:name', component: HotelDetailsComponent },
      { path: 'hotel-booking', component: BookingFormComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
