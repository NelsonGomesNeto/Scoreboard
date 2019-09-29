import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from 'src/utils';
import { Competition } from 'src/app/model/competition';
import { Competidor } from 'src/app/model/competidor';
import { Problem } from 'src/app/model/problem';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getStandings(id: number) {
    return this.http.get(Utils.url + '/standings/' + id.toString());
  }

  getCompetitions() {
    return this.http.get(Utils.url + '/competitions');
  }

  removeCompetition(id: number) {
    return this.http.delete(Utils.url + '/competition/' + id.toString(), {headers: {'token': this.authenticationService.token}});
  }

  addCompetition(competition: Competition) {
    return this.http.post(Utils.url + '/competitions', {token: this.authenticationService.token, competition: competition});
  }

  changeSchedule(id: number, schedule: any) {
    return this.http.patch(Utils.url + '/competition/' + id.toString() + '/changeSchedule', {token: this.authenticationService.token, schedule: schedule});
  }

  addProblem(id: number, problem: Problem) {
    return this.http.put(Utils.url + '/competition/' + id.toString() + '/newProblem', {token: this.authenticationService.token, problem: problem})
  }

  removeProblem(id: number, problem: Problem) {
    return this.http.delete(Utils.url + '/competition/' + id.toString() + '/problem/' + problem.id.toString(), {headers: {'token': this.authenticationService.token}});
  }
  
  addCompetidor(id: number, competidor: Competidor) {
    return this.http.put(Utils.url + '/competition/' + id.toString() + '/newCompetidor', {token: this.authenticationService.token, competidor: competidor});
  }

  removeCompetidor(id: number, competidor: Competidor) {
    return this.http.delete(Utils.url + '/competition/' + id.toString() + '/competidor/' + competidor.id.toString(), {headers: {'token': this.authenticationService.token}});
  }
}
