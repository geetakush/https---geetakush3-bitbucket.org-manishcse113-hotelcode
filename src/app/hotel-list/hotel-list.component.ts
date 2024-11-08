import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryserviceService } from '../services/countryservice.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMapComponent } from '../shared/google-map/google-map.component';
import { throwError, of } from 'rxjs';
import { catchError, retryWhen, delay, take, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  hotelrates:any=[];
  budgetRange: number = 0;
  starRating: number = 0;
  location: string = '';
  latitude: any;
  longitude: any;
  selectedCountry: string = '';
  startDate: any = '';
  endDate: any = '';
  roomCount: number = 1;
  guestCount: number = 1;
  searchTerm: string = '';

  hotels: any[] = [];
  paginatedHotels: any[] = [];
  filteredHotels: any = [];
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 5;
  currentPageHotelIds: any[] = [];
  currentPageList: any[] = [];
  loading: boolean = true;
  buffering: boolean = true;

  constructor(
    private service: CountryserviceService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private ngZone: NgZone // Inject NgZone
  ) {}

  ngOnInit(): void {
    this.loading=true
    this.route.queryParams.subscribe(params => {
      this.selectedCountry = params['country'] || '';

      // Check for latitude and longitude or city
      if (params['latitude'] && params['longitude']) {
        this.latitude = params['latitude'];
        this.longitude = params['longitude'];
        this.location = ''; // Clear location as latitude/longitude takes priority
      } else {
        this.location = params['city'] || '';
        this.latitude = null;
        this.longitude = null;
      }

      console.log(params);
      this.getHotelList(); // Call API based on the available parameters
    });
  }

  getHotelList() {
    this.loading = true;  // Show loading screen

    if (this.latitude && this.longitude) {
      this.service.getHotelsByCoordinates(this.selectedCountry, this.latitude, this.longitude)
        .subscribe((res: any) => {
          this.hotels = res.data || [];
          debugger
          console.log(this.hotels)
          this.totalPages = Math.ceil(this.hotels.length / this.itemsPerPage);
          
          this.updatePaginatedHotels();
          // this.loading = false;  // Hide loading screen
        });
    } else if (this.location) {
      this.service.getHotels(this.selectedCountry, this.location)
        .subscribe((res: any) => {
          this.hotels = res.data || [];
          this.totalPages = Math.ceil(this.hotels.length / this.itemsPerPage);
          this.updatePaginatedHotels();
          // this.loading = false;  // Hide loading screen
        });
    } else {
      console.log('No location or coordinates provided.');
      this.loading = false;  // Hide loading if no data is fetched
    }
   
  }

  getHotelPriceList(ids: any[]) {
    const body = {
      "hotelIds": ids,
      "occupancies": [
        {
          "adults": 2,
          "children": [0]
        },
        {
          "adults": 2,
          "children": [0]
        }
      ],
      "currency": "INR",
      "guestNationality": "IN",
      "checkin": "2024-11-11",
      "checkout": "2024-11-13"
    }; 
    console.log(ids,body)
    this.service.getHotelPrice(body).subscribe((res: any) => {
      
      this.hotelrates=res.data.data;
      this.currentPageList.forEach((res:any)=>{
        this.hotelrates.forEach((element:any)=>{
          if(res.data.id ===element.hotelId){
            res['hotelartes']= element
            
          }
        })
      } )

     console.log(this.currentPageList)
    
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",this.hotelrates, res);
   
    });
  }

  
  updatePaginatedHotels() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    console.log(this.itemsPerPage)
    const endIndex = startIndex + this.itemsPerPage;
    console.log(this.itemsPerPage)
  
    // Slice hotels for the current page
    this.paginatedHotels = this.hotels.slice(startIndex, endIndex);
  
    // Ensure paginatedHotels is an array
    this.filteredHotels = Array.isArray(this.paginatedHotels) ? this.paginatedHotels : [];
  
    // Extract the hotel IDs from the paginated hotels
    const hotelIds = this.filteredHotels.map((hotel: any) => hotel.id);
    this.currentPageHotelIds = hotelIds;
    console.log(this.currentPageHotelIds);
  
    // Call getHotelPriceList if hotelIds are present
    if (this.currentPageHotelIds.length > 0) {
      this.getHotelPriceList(this.currentPageHotelIds);
  
      // Construct the params string with multiple hotelId query parameters
      const params = hotelIds.map((id: any) => `${id}`);
  
      // Retry logic for API call with manual error checking
      this.service.getHotelDetails(params)
        .pipe(
          switchMap((hotelDetails: any) => {
            // Check if the API response contains an error
            if (hotelDetails.error) {
              console.error('API responded with an error:', hotelDetails.error);
              // Manually throw an error to trigger retry
              return throwError(() => new Error('Failed to fetch hotel details'));
            } else {
              // If no error, return the hotelDetails
              this.getHotelPriceList(this.currentPageHotelIds)
              return of(hotelDetails);
            }
          }),
          retryWhen(errors =>
            errors.pipe(
              tap((error) => {
                console.log('Error occurred, retrying...', error);
              }),
              delay(1000),  // Wait for 1 second before retrying
              take(3)  // Retry 3 times
            )
          ),
          catchError((error) => {
            console.error('Error after retries:', error);
            return throwError(() => new Error('Failed to fetch hotel details after retries.'));
          })
        )
        .subscribe({
          next: (hotelDetails: any) => {
            console.log(hotelDetails);
            this.ngZone.run(() => {
              this.currentPageList = Array.isArray(hotelDetails) ? hotelDetails : [];
              console.log(this.currentPageList);
            });
            this.loading = false;
          },
          error: (err) => {
            console.error('Final error after retries:', err);
            this.ngZone.run(() => {
              this.currentPageList = [];
            });
            this.loading = false;
          }
        });
    } else {
      // If no hotel IDs are found, reset currentPageList
      this.ngZone.run(() => {
        this.currentPageList = [];
      });
      this.loading = false;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedHotels();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedHotels();
    }
  }

  getHotelName(id: any) {
    const hotel = this.hotels.find(h => h.id === id);
    return hotel ? hotel.name : 'Hotel not found';
  }

  openMapDialog(location: any): void {
    const { latitude, longitude } = location;
    console.log(latitude, longitude);
    this.dialog.open(GoogleMapComponent, {
      data: {
        lat: latitude, // Replace with actual latitude
        lng: longitude // Replace with actual longitude
      }
    });
  }

  onViewDetails(id: any, hotelName: any) {
    this.router.navigate(['/hotel-details', id, hotelName]);
  }
  
  onBookHotel(id:any, hotelname:any){
    this.router.navigate(['/hotel-booking'])
  }
}
