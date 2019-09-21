import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  url = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getStandings() {
    return this.http.get(this.url + 'standings');
  }
}
