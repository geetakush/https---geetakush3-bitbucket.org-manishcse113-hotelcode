import { Component } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';
import { CountryserviceService } from '../services/countryservice.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  parentSelectedCountry: string = '';
  city:string = '';
  selectedCountry:any = 'select country'
  countries: any = [];
  latitude: any;
  longitude: any;
  constructor(private countryService: CountryserviceService ,
    private geolocationService: GeolocationService,
    private userDataService: UserDataService){
    this.geolocationService.getLocation().then(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    
      // Store latitude and longitude in localStorage
      localStorage.setItem('latitude', this.latitude.toString());
      localStorage.setItem('longitude', this.longitude.toString());
    
      console.log(this.latitude, this.longitude);
    
      // Use the stored latitude and longitude to get the country
      this.countryService.getCountry(this.latitude, this.longitude).subscribe((res: any) => {
        console.log(res.data[0]);
        const {county , country_code} = res.data[0]
        this.userDataService.updateUserDetails({          
          city: county,
          country: country_code.substring(0, 2).toUpperCase()
        });
        console.log(county, country_code)
        this.city = county
        this.parentSelectedCountry = country_code

        this.countryService.getHotels(country_code.substring(0, 2).toUpperCase() , county).subscribe((res:any)=>{
          console.log(res.data)
        })
      });
    })


    
}

  // Method to handle the data from the child
  onCountryChange(selectedCountry: string) {
    this.parentSelectedCountry = selectedCountry;
    console.log('Selected country in parent:', this.parentSelectedCountry);
  }
  
  getCountryCode(countryName:any) {
    // Convert the input country name to lowercase to handle case insensitivity
    const nameLower = countryName.toLowerCase();

    // Use the find method to search for the country by name
    const country = this.countries.find((country:any) => country.name.toLowerCase() === nameLower);

    // If the country is found, return the code; otherwise, return null or an appropriate message
    return country ? country.code : 'Country not found';
}

}
