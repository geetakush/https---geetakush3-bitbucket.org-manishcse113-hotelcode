import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryserviceService {
  private readonly baseUrl = 'https://fwubvpejz0.execute-api.ap-south-1.amazonaws.com/dev/data';
  private readonly timeout = 'timeout=1.5';
  
  private readonly endpoints = {
    getCountries: `${this.baseUrl}/countries?${this.timeout}`,
    getCities: `${this.baseUrl}/cities?${this.timeout}`,
    getHotelList: `${this.baseUrl}/hotels?${this.timeout}`,
    getAirports: `${this.baseUrl}/iataCodes?${this.timeout}`,
    getHotelDetails: `${this.baseUrl}/hotel-details?timeout=8`,
    getHotelReviews: `${this.baseUrl}/reviews?limit=1000&${this.timeout}`,
    getHotelPrice: `${this.baseUrl}/fullRates`,
    getPreBooking: `https://fwubvpejz0.execute-api.ap-south-1.amazonaws.com/dev/booking/prebook?timeout=30`
  };

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get(this.endpoints.getCountries);
  }

  getCities(countryCode: string): Observable<any> {
    return this.http.get(this.endpoints.getCities, { params: this.createHttpParams({ countryCode }) });
  }

  getHotels(country: string, city: string): Observable<any> {
    return this.http.get(this.endpoints.getHotelList, { params: this.createHttpParams({ countryCode: country, cityName: city }) });
  }

  getHotelsByCoordinates(country: string, latitude: string, longitude: string): Observable<any> {
    return this.http.get(this.endpoints.getHotelList, { params: this.createHttpParams({ countryCode: country, latitude, longitude }) });
  }

  getHotelDetails(ids: string[]): Observable<any> {
    const params = ids.reduce((httpParams, id) => httpParams.append('hotelId', id), new HttpParams());
    return this.http.get(this.endpoints.getHotelDetails, { params });
  }

  getHotelReviews(hotelId: string): Observable<any> {
    return this.http.get(this.endpoints.getHotelReviews, { params: this.createHttpParams({ hotelId }) });
  }

  getHotelPrice(body: any): Observable<any> {
    return this.http.post(this.endpoints.getHotelPrice, body);
  }

  getAirports(countryCode: string): Observable<any> {
    return this.http.get(this.endpoints.getAirports, { params: this.createHttpParams({ countryCode }) });
  }

  getCountry(lat: number, lng: number): Observable<any> {
    const params = {
      access_key: '85442ac30273577700e115bd49a19ab1',
      query: `${lat},${lng}`
    };
    return this.http.get('https://api.positionstack.com/v1/reverse', { params });
  }

  private createHttpParams(paramsObject: Record<string, string>): HttpParams {
    let params = new HttpParams();
    Object.keys(paramsObject).forEach(key => {
      params = params.append(key, paramsObject[key]);
    });
    return params;
  }

  createPreBooking(body:any){
    return this.http.post(this.endpoints.getPreBooking, body);
  }
}
