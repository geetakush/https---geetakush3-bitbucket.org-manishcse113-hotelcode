import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CountryserviceService } from '../../services/countryservice.service';
import { GeolocationService } from '../../services/geolocation.service';
import { UserDataService } from '../../services/user-data.service';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedCountry:any = 'select country'
  countries: any = [];
  dropdownVisible = false;
  images = ['assets/images/home1.jpg',
     'assets/images/home2.jpg',
     'assets/images/home3.jpg',
     'assets/images/home4.jpg',
     'assets/images/home5.jpg',
     'assets/images/home6.jpg',
     'assets/images/home7.jpg',
     'assets/images/home8.jpg',
     'assets/images/home9.jpg',
     'assets/images/home10.jpg',
     'assets/images/home11.jpg',
     'assets/images/home12.jpg',
     'assets/images/home13.jpg'];
  
  @Input() Home:string = 'true';
  @Output() countryChange = new EventEmitter<string>(); 
  
  
  constructor(private countryService: CountryserviceService,@Inject(DOCUMENT) public document: Document, private userData : UserDataService,private router: Router,public auth: AuthService) { }
  
  ngOnInit(): void {

    this.userData.userDetails$.subscribe((res:any)=>{
      console.log(res)
      this.selectedCountry = res.country
    })
    this.loadCountries();   
  
  }

 
  
  loadCountries(): void {
    this.countryService.getCountries().subscribe((data:any) => {
      const response = data
      this.countries = response.data;
      console.log(this.countries)
    });
  }
  
  toggleDropdown(): void {this.dropdownVisible = !this.dropdownVisible;}
  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCountry= selectElement.value;
    this.countryChange.emit(this.selectedCountry);
    // console.log('Selected country code:', selectedCountryCode);
    // Add logic to handle country change
  }

  navigateHome(): void {
    this.router.navigate(['/home']);
  }
}
