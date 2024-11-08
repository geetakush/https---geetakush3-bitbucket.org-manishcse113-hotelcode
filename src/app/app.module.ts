import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from "./shared/shared.module";
import { BookingFormComponent } from './booking-form/booking-form.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { GalleriaModule } from 'primeng/galleria';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarouselModule } from 'primeng/carousel'; 
import { ButtonModule } from 'primeng/button';
import { AuthModule } from '@auth0/auth0-angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HotelListComponent,
    BookingFormComponent,
    HotelDetailsComponent,
    DashboardComponent,
     // Add ReactiveFormsModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule, // Add FormsModule
    ReactiveFormsModule,
    NgbDatepickerModule,
    SharedModule,
    MatDialogModule,
    GalleriaModule,
    HttpClientModule,
    CarouselModule,
    ButtonModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatInputModule,
    AuthModule.forRoot({
      domain: 'dev-t68t7j41t02tu13x.us.auth0.com',
      clientId: 'kNvWifMnK070QpZD2q94CzIMRs0EJN9C',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
