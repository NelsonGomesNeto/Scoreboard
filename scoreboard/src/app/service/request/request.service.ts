import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from 'src/utils';
import { Competition } from 'src/app/model/competition';
import { Competidor } from 'src/app/model/competidor';
import { Problem } from 'src/app/model/problem';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getStandings(id: number) {
    return this.http.get(environment.api_url + '/standings/' + id.toString());
  }

  getCompetitions() {
    return this.http.get(environment.api_url + '/competitions');
  }

  removeCompetition(id: number) {
    return this.http.delete(environment.api_url + '/competition/' + id.toString(), {headers: {'token': this.authenticationService.token}});
  }

  addCompetition(competition: Competition) {
    return this.http.post(environment.api_url + '/competitions', {token: this.authenticationService.token, competition: competition}, {headers: {'token': this.authenticationService.token}});
  }

  editInfo(id: number, info: any) {
    return this.http.patch(environment.api_url + '/competition/' + id.toString() + '/editInfo', {token: this.authenticationService.token, info: info}, {headers: {'token': this.authenticationService.token}});
  }

  editSchedule(id: number, schedule: any) {
    return this.http.patch(environment.api_url + '/competition/' + id.toString() + '/editSchedule', {token: this.authenticationService.token, schedule: schedule}, {headers: {'token': this.authenticationService.token}});
  }

  addProblem(id: number, problem: Problem) {
    return this.http.put(environment.api_url + '/competition/' + id.toString() + '/newProblem', {token: this.authenticationService.token, problem: problem}, {headers: {'token': this.authenticationService.token}})
  }

  removeProblem(id: number, problem: Problem) {
    return this.http.delete(environment.api_url + '/competition/' + id.toString() + '/problem/' + problem.id.toString(), {headers: {'token': this.authenticationService.token}});
  }

  editProblemColor(id: number, problem: Problem) {
    return this.http.patch(environment.api_url + '/competition/' + id.toString() + '/problem/' + problem.id.toString(), {token: this.authenticationService.token, color: problem.color}, {headers: {'token': this.authenticationService.token}});
  }
  
  addCompetidor(id: number, competidor: Competidor) {
    return this.http.put(environment.api_url + '/competition/' + id.toString() + '/newCompetidor', {token: this.authenticationService.token, competidor: competidor}, {headers: {'token': this.authenticationService.token}});
  }

  removeCompetidor(id: number, competidor: Competidor) {
    return this.http.delete(environment.api_url + '/competition/' + id.toString() + '/competidor/' + competidor.id.toString(), {headers: {'token': this.authenticationService.token}});
  }
}
