import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
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
  newCompetitionStartDate = '';
  newCompetitionStartTime = '';
  newCompetitionEndDate = '';
  newCompetitionEndTime = '';

  constructor(private server: RequestService, private authenticationService: AuthenticationService, private route: Router) { }

  ngOnInit() {
    if (!this.authenticationService.isLogged())
      this.route.navigate(['/login']);
    this.server.getCompetitions().subscribe((data: any) => {
      this.competitions = data.competitions;
      console.log(this.competitions);
    });
  }

  logout() {
    this.authenticationService.logout();
  }

  addCompetition() {
    var startTime = new Date(this.newCompetitionStartDate);
    startTime.setHours(Number(this.newCompetitionStartTime.split(':')[0]), Number(this.newCompetitionStartTime.split(':')[1]));
    var endTime = new Date(this.newCompetitionEndDate);
    endTime.setHours(Number(this.newCompetitionEndTime.split(':')[0]), Number(this.newCompetitionEndTime.split(':')[1]));
    this.server.addCompetition(new Competition(-1, this.newCompetitionName, startTime, endTime)).subscribe((newCompetition: Competition) => {
      this.competitions.push(newCompetition);
    });
    this.newCompetitionName = this.newCompetitionStartDate = this.newCompetitionEndDate = this.newCompetitionStartTime = this.newCompetitionEndTime = '';
  }

  removeCompetition(competition: Competition) {
    this.server.removeCompetition(competition.id).subscribe((competitions: Competition[]) => {
      this.competitions = competitions;
    })
  }

  changeSchedule(competition: Competition) {
    var startTime = new Date(this.newCompetitionStartDate);
    startTime.setHours(Number(this.newCompetitionStartTime.split(':')[0]), Number(this.newCompetitionStartTime.split(':')[1]));
    var endTime = new Date(this.newCompetitionEndDate);
    endTime.setHours(Number(this.newCompetitionEndTime.split(':')[0]), Number(this.newCompetitionEndTime.split(':')[1]));
    this.server.changeSchedule(competition.id, {startTime: startTime.getTime(), endTime: endTime.getTime()}).subscribe((updatedCompetition: Competition) => {
      competition.startTime = updatedCompetition.startTime;
      competition.endTime = updatedCompetition.endTime;
    });
  }

  addProblem(competition: Competition) {
    this.server.addProblem(competition.id, new Problem(Number(this.newProblemId))).subscribe((newProblem: Problem) => {
      competition.problems.push(newProblem);
    });
    this.newProblemId = '';
  }

  removeProblem(competition: Competition, j: number) {
    this.server.removeProblem(competition.id, competition.problems[j]).subscribe((updatedCompetition: Competition) => {
      competition.problems.splice(j, 1);
    });
  }

  addCompetidor(competition: Competition) {
    this.server.addCompetidor(competition.id, new Competidor(Number(this.newCompetidorId), this.newCompetidorName)).subscribe((newCompetidor: Competidor) => {
      competition.competidors.push(newCompetidor);
    });
    this.newCompetidorId = this.newCompetidorName = '';
  }

  removeCompetidor(competition: Competition, j: number) {
    this.server.removeCompetidor(competition.id, competition.competidors[j]).subscribe((updatedCompetition: Competition) => {
      console.log(updatedCompetition);
      competition.competidors.splice(j, 1);
    });
  }

  invalidNewCompetition(withCompetitionName = true) {
    if ((withCompetitionName && this.newCompetitionName == '') || this.newCompetitionStartDate == '' || this.newCompetitionEndDate == '' || this.newCompetitionStartTime == '' || this.newCompetitionEndTime == '') return true;
    var startTime = new Date(this.newCompetitionStartDate);
    startTime.setHours(Number(this.newCompetitionStartTime.split(':')[0]), Number(this.newCompetitionStartTime.split(':')[1]));
    var endTime = new Date(this.newCompetitionEndDate);
    endTime.setHours(Number(this.newCompetitionEndTime.split(':')[0]), Number(this.newCompetitionEndTime.split(':')[1]));
    if (startTime.getTime() >= endTime.getTime()) return true;
    return false;
  }

  invalidNumber(num: any) {
    if (num == '') return true;
    return isNaN(num);
  }
}
