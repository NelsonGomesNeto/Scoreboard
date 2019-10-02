import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from 'src/utils';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token: string = '';
  obs = new BehaviorSubject(null);

  constructor(private http: HttpClient, private route: Router) {
    this.token = localStorage.getItem('token');
    if (this.token == null) this.token = '';

    this.isValid(this.token).subscribe((valid: boolean) => {
      if (!valid) {
        this.token = '', localStorage.removeItem('token');
        console.log('token was invalid. Log in again');
      } else {
        console.log('token: ' + this.token);
      }
      this.obs.next(this.token);
    });
  }

  getCompleteObs() {
    return this.obs;
  }

  isLogged() {
    return this.token != '';
  }

  isValid(token) {
    return this.http.post(environment.api_url + '/valid', {token: token});
  }

  login(username, password) {
    return this.http.post(environment.api_url + '/login', {username: username, password: password}).subscribe((token: string) => {
      this.token = token, localStorage.setItem('token', token);
      this.route.navigate(['/admin']);
      console.log('Logged in');
    });
  }

  logout() {
    this.token = '', localStorage.removeItem('token');
    this.route.navigate(['/login']);
    console.log('Logged out');
  }
}
