import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CountryserviceService } from '../../services/countryservice.service';
import { UserDataService } from '../../services/user-data.service';

interface City {
  city: string;
}

interface Airport {
  name: string;
  code: string;
  latitude:any;
  longitude:any;
}

type Street = City | Airport;

@Component({
  selector: 'app-date-guest-selector',
  templateUrl: './date-guest-selector.component.html',
  styleUrls: ['./date-guest-selector.component.scss']
})
export class DateGuestSelectorComponent {
  selectedCountry: string = '';
  location: string = '';
  startDate: string = '';
  endDate: string = '';
  roomCount: number = 1;
  adultCount: number = 1;
  childrenCount: number = 1;

  control = new FormControl('');
  countryControl = new FormControl('');

  streets: Street[] = [];
  countries: any = [];

  filteredStreets: any;
  filteredCountries: any;
  reorderedCountries: any;  // New variable for reordering countries

  popupVisible: boolean = false;
  latitude: any;
  longitude: any;

  constructor(
    private service: CountryserviceService,
    private userData: UserDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userData.userDetails$.subscribe((res: any) => {
      this.selectedCountry = res.country;
      this.location = res.city;
      this.countryControl.setValue(this.selectedCountry);
      this.loadLocations();
    });

    this.loadCountries();
  }

  loadCountries(): void {
    this.service.getCountries().subscribe((res: any) => {
      this.countries = res.data || [];
      this.filteredCountries = this.countryControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCountries(value || ''))
      );
      this.reorderCountries();  // Reorder countries after loading
    });
  }

  loadLocations(): void {
    if (this.selectedCountry) {
      forkJoin([
        this.service.getAirports(this.selectedCountry),
        this.service.getCities(this.selectedCountry)
      ]).subscribe(([airportsRes, citiesRes]: [any, any]) => {
        const airports = (airportsRes.data || []).filter(
          (airport: any) => airport.countryCode === this.selectedCountry
        );
        const cities = citiesRes.data || [];
        this.streets = [...airports, ...cities];

        this.filteredStreets = this.control.valueChanges.pipe(
          startWith(''),
          map(value => this._filterStreets(value || ''))
        );
      });
    }
  }

  // Reorder countries to have the selected country at the top
  reorderCountries(): void {
    if (this.selectedCountry) {
      this.reorderedCountries = [
        ...this.countries.filter((country: any) => country.code === this.selectedCountry),
        ...this.countries.filter((country: any) => country.code !== this.selectedCountry)
      ];
    } else {
      this.reorderedCountries = [...this.countries];
    }
  }

  private _filterStreets(value: string): Street[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street =>
      this.getDisplayValue(street).toLowerCase().startsWith(filterValue)
    );
  }

  private _filterCountries(value: string): any[] {
    const filterValue = this._normalizeValue(value);
    return this.countries.filter((country: any) =>
      this._normalizeValue(country.name).startsWith(filterValue)
    );
  }

  private _normalizeValue(value: string | null | undefined): string {
    return (value || '').toLowerCase().replace(/\s/g, '');
  }

  getDisplayValue(street: Street): string {
    if ('city' in street) {
      return `${street.city}`;
    } else if ('name' in street) {
      return `${street.name} (${street.code})`;
    }
    return '';
  }

  // Handle selection of city or airport
  onCityOrAirportSelected(event: any): void {
    const selectedValue = event.option.value;
  
    // Find the selected city or airport from the streets list
    const selectedItem = this.streets.find((item: Street) => {
      if ('city' in item && item.city === selectedValue) {
        return true;
      }
      if ('name' in item && (item.name === selectedValue || `${item.name} (${item.code})` === selectedValue)) {
        return true;
      }
      return false;
    });
  
    if (selectedItem) {
      // If the selected item is a city
      if ('city' in selectedItem) {
        this.location = selectedItem.city;
      } 
      // If the selected item is an airport
      else if ('name' in selectedItem) {
        this.latitude = selectedItem.latitude;
        this.longitude = selectedItem.longitude;
      }
  
      // Update the filteredStreets to show the selected item at the top and keep the search functionality
      this.filteredStreets = this.control.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filtered = this._filterStreets(value || '');
          return [selectedItem, ...filtered.filter(item => item !== selectedItem)];
        })
      );
    }
  }
  

  togglePopup(): void {
    this.popupVisible = !this.popupVisible;
  }

  increaseRoom(): void {
    this.roomCount++;
  }

  decreaseRoom(): void {
    if (this.roomCount > 1) {
      this.roomCount--;
    }
  }

  increaseAdult(): void {
    this.adultCount++;
  }

  decreaseAdult(): void {
    if (this.adultCount > 1) {
      this.adultCount--;
    }
  }

  increaseChild(): void {
    this.childrenCount++;
  }

  decreaseChild(): void {
    if (this.childrenCount > 1) {
      this.childrenCount--;
    }
  }

  search(): void {

    console.log('entered search')
    if (this.selectedCountry) {
      const queryParams: any = {
        country: this.selectedCountry,
        startDate: this.startDate,
        endDate: this.endDate,
        roomCount: this.roomCount,
        adultCount: this.adultCount,
        childrenCount: this.childrenCount
      };

      if (this.latitude && this.longitude) {
        queryParams.latitude = this.latitude;
        queryParams.longitude = this.longitude;
      } else if (this.location) {
        queryParams.city = this.location;
      } else {
        console.log('Please select both country and city or airport.');
        return;
      }

      this.router.navigate(['/hotel-list'], { queryParams });
    } else {
      console.log('Please select both country and city or airport.');
    }
  }

  onDateSelect(e: any): void {
    console.log('Selected date:', e);
  }

  onCountrySelected(event: any): void {
    const selectedCountryName = event.option.value;
  
    // Find the selected country from the countries list
    const selectedCountry = this.countries.find(
      (country: any) => country.name === selectedCountryName
    );
  
    if (selectedCountry) {
      // Set the selected country code
      this.selectedCountry = selectedCountry.code;
  
      // Reset selected city/airport and coordinates
      this.location = '';
      this.latitude = null;
      this.longitude = null;
      this.control = new FormControl('');
  
      // Clear the streets list (city and airport options)
      this.streets = [];
  
      // Refresh the city and airport list based on the new country
      this.loadLocations();
  
      // Update the filteredCountries to show the selected country at the top and keep the search functionality
      this.filteredCountries = this.countryControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filtered = this._filterCountries(value || '');
          return [selectedCountry, ...filtered.filter(country => country !== selectedCountry)];
        })
      );
    }
  }
  
  
}
