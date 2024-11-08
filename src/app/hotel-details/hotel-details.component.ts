import { Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CountryserviceService } from "../services/countryservice.service";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent implements OnInit {


  images: any[] = [];
  rooms: any[] = [];
  hotelFacilities: any[] = [];
  hotelLocation: any = {};
  hotelId: string | null = null;
  hotelName: any;
  hotelDetails: any;
  bookingForm: FormGroup;
  startDate: string = '';
  endDate: string = '';
  roomCount: number = 1;
  guestCount: number = 1;
  popupVisible: boolean = false;
  roomTypes: string[] = ['Single', 'Double', 'Suite', 'Deluxe'];
  selectedRoomType: string = this.roomTypes[0];
  displayedAmenities: any = [];
  showAll = false;
  showMoreD: boolean = false;
  truncatedDescription: string = '';
  fullDescription: string = '';
  currentDescription: string = '';
  reviews: any[] = [];
  ratingSummary: any;
  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ]
  hotelRoomRatesData: any;
  selectedRoom: any;
  selectedIndex: any = 1;
  // hotelRoomRatesData: any; 
  isPriceLoading: boolean = true;

  constructor(private route: ActivatedRoute, private service: CountryserviceService, private fb: FormBuilder, private ngZone: NgZone) {
    this.bookingForm = this.fb.group({
      checkinDate: [''],
      checkoutDate: [''],
      guests: [''],
      roomType: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.hotelId = params.get('id');
      this.hotelName = params.get('name')
      console.log('Hotel ID:', this.hotelId);
      this.loadHotelDetails(this.hotelId);
    });
  }

  calculateRatingSummary(): void {
    const totalReviews = this.reviews.length;

    // Initialize rating categories from 10 to 1
    const categories = Array.from({ length: 10 }, (_, i) => ({
      score: 10 - i, // Reverse order: 10 to 1
      label: (10 - i).toString()  // Display rating number as label
    }));

    // Count the number of reviews for each category
    const ratingCounts = categories.map(cat => ({
      ...cat,
      count: this.reviews.filter((review: any) => review.averageScore === cat.score).length
    }));

    // Calculate percentage
    this.ratingSummary = ratingCounts.map(cat => ({
      ...cat,
      percentage: (cat.count / totalReviews) * 100
    }));
  }



  loadHotelDetails(id: any | null): void {
    console.log('id is', id)
    if (id != '') {
      this.service.getHotelDetails([id]).subscribe((res: any) => {
        this.hotelDetails = res[0].data;
        console.log(res[0].data)
        this.images = res[0].data.hotelImages;
        this.hotelFacilities = res[0].data.facilities; // Assuming facilities are provided
        this.hotelLocation = res[0].data.location;
        this.displayedAmenities = this.hotelFacilities?.slice(0, 3);

        console.log(this.hotelDetails)
        if (this.hotelDetails?.rooms?.length) {
          this.selectedRoom = this.hotelDetails.rooms[0];
        }

        this.service.getHotelReviews(id).subscribe((res: any) => {
          this.reviews = res.data;
          this.calculateRatingSummary(); // Call after reviews are loaded
          console.log(res.data);
        });
      });

      const body = {
        hotelIds: [id],
        occupancies: [
          {
            adults: 2,
            children: [0]
          },
          {
            adults: 2,
            children: [0]
          }
        ],
        currency: "INR",
        guestNationality: "IN",
        checkin: "2024-11-12",
        checkout: "2024-11-13"
      };

      this.service.getHotelPrice(body).subscribe((res: any) => {
        this.ngZone.run(() => {
        
          this.hotelRoomRatesData = res.data.data[0];
          console.log("this")
          console.log(this.hotelRoomRatesData)
          console.log("this")

          if (this.hotelDetails?.rooms?.length) {
            this.selectedRoom = this.hotelDetails.rooms[0];
          }

          // Hide the loading animation once the data is loaded
          this.isPriceLoading = false;
        });
      })
    }
  }

  onSubmit(): void {
    console.log('Booking confirmed', this.bookingForm.value);
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

  increaseGuest(): void {
    this.guestCount++;
  }

  decreaseGuest(): void {
    if (this.guestCount > 1) {
      this.guestCount--;
    }
  }




  showMore() {
    this.displayedAmenities = this.hotelFacilities;
    this.showAll = true;
  }

  showLess() {
    this.displayedAmenities = this.hotelFacilities.slice(0, 3);
    this.showAll = false;
  }

  getTruncatedDescription(): string {
    const maxLength = 200;  // Number of characters to show
    const description = this.hotelDetails.hotelDescription;

    if (description.length <= maxLength) {
      return description;  // No truncation needed
    }

    // Truncate description and add ellipsis
    const truncated = description.slice(0, maxLength);
    return truncated + '...';  // Add ellipsis to truncated text
  }
  getStars(score: number): number[] {
    const maxStars = 5; // Assuming a max rating of 5
    return Array(Math.round(score / 2)).fill(0);
  }

  selectRoom(index: number) {
    this.selectedIndex = index
    this.selectedRoom = this.hotelDetails.rooms[index];
    console.log(index, this.selectedRoom)
  }

  continueBooking() {
    const offerId = this.hotelRoomRatesData.roomTypes[this.selectedIndex].offerId
    const body = {
      "offerId": offerId,
      "usePaymentSdk": true
    }

    this.service.createPreBooking(body).subscribe((res: any) => {
      console.log(res)
    })
  }
}
