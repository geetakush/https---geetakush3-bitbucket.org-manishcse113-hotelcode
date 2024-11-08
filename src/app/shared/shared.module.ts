import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { DateGuestSelectorComponent } from './date-guest-selector/date-guest-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchFiltersComponent,
    DateGuestSelectorComponent,
    GoogleMapComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule, // Add FormsModule
    ReactiveFormsModule,
    NgbDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    GoogleMapsModule,
    
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    SearchFiltersComponent,
    DateGuestSelectorComponent,
    GoogleMapComponent
  ]
})
export class SharedModule { }
