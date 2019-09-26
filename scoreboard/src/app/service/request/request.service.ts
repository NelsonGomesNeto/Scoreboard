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

  removeCompetition(id: number) {
    return this.http.delete(Utils.url + '/competition/' + id.toString());
  }

  addCompetition(competition: Competition) {
    return this.http.post(Utils.url + '/competitions', competition);
  }

  changeSchedule(id: number, schedule: any) {
    return this.http.patch(Utils.url + '/competition/' + id.toString() + '/changeSchedule', schedule);
  }

  addProblem(id: number, problem: Problem) {
    return this.http.put(Utils.url + '/competition/' + id.toString() + '/newProblem', problem)
  }

  removeProblem(id: number, problem: Problem) {
    return this.http.delete(Utils.url + '/competition/' + id.toString() + '/problem/' + problem.id.toString());
  }
  
  addCompetidor(id: number, competidor: Competidor) {
    return this.http.put(Utils.url + '/competition/' + id.toString() + '/newCompetidor', competidor);
  }

  removeCompetidor(id: number, competidor: Competidor) {
    return this.http.delete(Utils.url + '/competition/' + id.toString() + '/competidor/' + competidor.id.toString());
  }
}
