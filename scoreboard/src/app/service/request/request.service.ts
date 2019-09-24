import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from 'src/utils';
import { Competition } from 'src/app/model/competition';
import { Competidor } from 'src/app/model/competidor';
import { Problem } from 'src/app/model/problem';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  getStandings(id: number) {
    return this.http.get(Utils.url + '/standings/' + id.toString());
  }

  getCompetitions() {
    return this.http.get(Utils.url + '/competitions');
  }

  addCompetition(competition: Competition) {
    return this.http.post(Utils.url + '/competitions', competition);
  }

  addCompetidor(id: number, competidor: Competidor) {
    return this.http.put(Utils.url + '/competition/' + id.toString() + '/newCompetidor', competidor);
  }

  addProblem(id: number, problem: Problem) {
    return this.http.put(Utils.url + '/competition/' + id.toString() + '/newProblem', problem)
  }
}
