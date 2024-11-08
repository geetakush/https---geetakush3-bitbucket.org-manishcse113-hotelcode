import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent{
  @Input() hotels: any[] = [];  // Array of hotels with lat, lng, and name
  zoom = 10;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };  // Set default center

  ngOnInit() {
    console.log(this.hotels)
    if (this.hotels.length > 0) {
      this.center = { lat: this.hotels[0].data.location.latitude, lng: this.hotels[0].data.location.longitude };
    }
  }

  openInfo(hotel: any) {
    // Display hotel information when marker is clicked
    alert(`Hotel Name: ${hotel.name}`);
  }
}
