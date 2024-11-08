import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userDetails = new BehaviorSubject<any>({
    name: '',
    email: '',
    city: '',
    country: ''
  });

  // Observable to allow other components to subscribe to user details
  userDetails$ = this.userDetails.asObservable();

  constructor() { }

  // Method to update user details
  updateUserDetails(details: { name?: string, email?: string, city?: string, country?: string }) {
    const currentDetails = this.userDetails.value;
    this.userDetails.next({ ...currentDetails, ...details });

    console.log(this.userDetails.value)
  }

  // Method to retrieve user details (synchronously)
  getUserDetails() {
    return this.userDetails.value;
  }
}
