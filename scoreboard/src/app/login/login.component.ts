import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';

  constructor(private authenticationService: AuthenticationService, private route: Router) { }

  ngOnInit() {
    if (this.authenticationService.isLogged()) {
      this.route.navigate(['/admin']);
    }
  }

  valid() {
    return this.username.length && this.password.length;
  }

  login() {
    this.authenticationService.login(this.username, this.password);
    this.username = this.password = '';
  }
}
