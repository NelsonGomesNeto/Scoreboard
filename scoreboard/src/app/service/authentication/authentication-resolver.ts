import { Resolve } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationResolver implements Resolve<any> {

  constructor(private authenticationService: AuthenticationService) { }

  resolve() {
    return new Observable((observer) => {
      this.authenticationService.getCompleteObs().subscribe((token) => {
        if (token == null) return;
        observer.next(token);
        observer.complete();
      });
    });
  }

}