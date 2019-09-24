import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { Router } from '@angular/router';
import { RequestService } from '../service/request/request.service';
import { Competition } from '../model/competition';
import { Competidor } from '../model/competidor';
import { Problem } from '../model/problem';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  competitions: Competition[];
  newProblemId = '';
  newCompetidorId = '';
  newCompetidorName = '';
  newCompetitionName = '';

  constructor(private server: RequestService, private authenticationService: AuthenticationService, private route: Router) { }

  ngOnInit() {
    if (!this.authenticationService.isLogged())
      this.route.navigate(['/login']);
    this.server.getCompetitions().subscribe((competitions: Competition[]) => {
      this.competitions = competitions;
      console.log(this.competitions);
    });
  }

  logout() {
    this.authenticationService.logout();
  }

  addCompetition() {
    this.server.addCompetition(new Competition(-1, this.newCompetitionName)).subscribe((newCompetition: Competition) => {
      this.competitions.push(newCompetition);
    });
    this.newCompetitionName = '';
  }

  addProblem(competition: Competition) {
    this.server.addProblem(competition.id, new Problem(Number(this.newProblemId))).subscribe((newProblem: Problem) => {
      competition.problems.push(newProblem);
    });
    this.newProblemId = '';
  }

  removeProblem(competition: Competition, j: number) {
    competition.problems.splice(j);
  }

  addCompetidor(competition: Competition) {
    this.server.addCompetidor(competition.id, new Competidor(Number(this.newCompetidorId), this.newCompetidorName)).subscribe((newCompetidor: Competidor) => {
      competition.competidors.push(newCompetidor);
    });
    this.newCompetidorId = this.newCompetidorName = '';
  }

  removeCompetidor(competition: Competition, j: number) {
    competition.competidors.splice(j);
  }
}
