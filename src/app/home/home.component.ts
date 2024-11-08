import { Component, OnInit } from '@angular/core';
import { CountryserviceService } from '../services/countryservice.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Corrected 'styleUrl' to 'styleUrls'
})
export class HomeComponent implements OnInit { // Implement OnInit
  private descriptionLimit = 150;  
  nearbyHotels: any[] = [];
  recommendedHotels: any;

  constructor(
    private countryService: CountryserviceService,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.userDataService.userDetails$.subscribe((res: any) => {
      console.log(res);

      this.countryService.getHotels(res.country, res.city).subscribe((res: any) => {
        console.log(res.data);
        this.nearbyHotels = res.data;
        
        // Initialize `isLongDescription` and `isExpanded` for each hotel
        this.nearbyHotels.forEach((hotel:any) => {
          hotel.isLongDescription = hotel.hotelDescription.length > this.descriptionLimit;
          hotel.isExpanded = false;
        });
        this.recommendedHotels = this.nearbyHotels.filter(hotel => hotel.stars > 3);
      });
    });
  }

  getDescription(hotel: any): string {
    if (hotel.isExpanded) {
      return hotel.hotelDescription;
    } else {
      return hotel.isLongDescription 
        ? hotel.hotelDescription.substring(0, this.descriptionLimit) + '...' 
        : hotel.hotelDescription;
    }
  }

  toggleDescription(hotel: any): void {
    hotel.isExpanded = !hotel.isExpanded;
  }

  filterHotelsByStars(minStars: number): void {
    
  }
}
