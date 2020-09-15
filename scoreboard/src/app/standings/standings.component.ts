import { Component, OnInit } from '@angular/core';
import { Competidor } from '../model/competidor';
import { RequestService } from '../service/request/request.service';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { ProblemStatus } from '../model/problem-status';
import { ActivatedRoute } from '@angular/router';
import { Competition } from '../model/competition';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-standings',
  animations: [
    trigger('updatedFreezeState', [
      state('frozen', style({
        opacity: 1
      })),
      state('notFrozen', style({
        opacity: 0
      })),

      transition('frozen <=> notFrozen',
        animate('3s')
      )
    ]),

    trigger('submitted', [
      state('noBalloon', style({
        backgroundColor: 'white'
      }), { params: {col: 'hsl(0, 100%, 45%)'}}),
      state('poppedBalloon0', style({
        backgroundColor: 'white'
      }), { params: {col: 'hsl(0, 100%, 45%)'}}),
      state('poppedBalloon1', style({
        backgroundColor: 'white'
      }), { params: {col: 'hsl(0, 100%, 45%)'}}),
      state('fullBalloon', style({
        backgroundColor: '{{col}}',
        transform: 'scale(1)'
      }), { params: {col: 'hsl(0, 100%, 45%)'}}),

      transition('poppedBalloon1 <=> poppedBalloon0',
        animate('3s', keyframes([
          style({ backgroundColor: '{{col}}', transform: 'scale(0)', offset: 0 }),
          style({ backgroundColor: '{{col}}', transform: 'scale(1)', offset: 0.95 }),
          style({ backgroundColor: 'white', transform: 'scale(0)', offset: 1 }),
        ]))
      ),
      transition('noBalloon => poppedBalloon1',
        animate('3s', keyframes([
          style({ backgroundColor: 'white', transform: 'scale(0)', offset: 0 }),
          style({ backgroundColor: '{{col}}', transform: 'scale(1)', offset: 0.95 }),
          style({ backgroundColor: 'white', transform: 'scale(0)', offset: 1 }),
        ]))
      ),
      transition('noBalloon => fullBalloon, poppedBalloon0 => fullBalloon, poppedBalloon1 => fullBalloon',
        animate('3s', keyframes([
          style({ backgroundColor: 'white', transform: 'scale(0)', offset: 0 }),
          style({ backgroundColor: '{{col}}', transform: 'scale(1)', offset: 0.95 }),
          style({ backgroundColor: '{{col}}', transform: 'scale(1.3)', offset: 0.975 }),
          style({ backgroundColor: '{{col}}', transform: 'scale(1)', offset: 1 }),
        ]))
      ),
    ])
  ],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {

  displayedColumns: string[] = [];
  columns: object[] = [];
  standings: Competition = new Competition(-1, '');
  position: number[] = [];
  updatedStandings: Competition = new Competition(-1, '');
  time: Date = new Date();
  id = 0;
  progressBarValue = 0;
  tick = false;
  originalMap: Map<number, number> = new Map();
  updatedMap: Map<number, number> = new Map();

  constructor(private server: RequestService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.server.getStandings(this.id).subscribe((data: any) => {
      this.standings = Competition.parse(data.standings);
      this.standings.competidors.sort(Competidor.compare);
      this.updatedStandings = this.standings;
      this.standings.competidors.forEach(competidor => {
        this.originalMap[competidor.id] = this.updatedMap[competidor.id] = this.position.length;
        this.position.push(this.position.length);
        for (var j = 0; j < this.standings.problems.length; j ++)
          competidor.problemsStatus[j].firstToSolve = competidor.problemsStatus[j].lastTime == this.standings.problems[j].firstSolve;
      });
      this.time = new Date(data.time);
      
      this.displayedColumns.push('name');
      this.columns.push({columnDef: 'name', header: 'Name', cell: (c: Competidor) => c.name});
      for (var i = 0; i < this.standings.problems.length; i ++) {
        let problemName = String.fromCharCode('A'.charCodeAt(0) + i);
        this.displayedColumns.push(problemName);
        this.columns.push({columnDef: problemName, header: problemName, cell: (c: Competidor, i: number) => ProblemStatus.toString(c.problemsStatus[i - 1])});
      }
      this.displayedColumns.push('total');
      this.columns.push({columnDef: 'total', header: 'Total', cell: (c: Competidor) => c.totalTime.toString() + ' (' + c.totalAccepted.toString() + ')'});
      
      this.progressBarValue = 100 * (this.time.getTime() - this.standings.startTime.getTime()) / (this.standings.endTime.getTime() - this.standings.startTime.getTime());
    });
    setInterval(() => this.updateStandings(), 10000);
  }

  frozenScoreboard() {
    let endTime = new Date(this.standings.endTime);
    let freezeTime = new Date(endTime.getTime() - this.standings.frozenMinutes * 60000).getTime();
    return this.time.getTime() >= freezeTime && this.time.getTime() < endTime.getTime();
  }

  getFreezeState() {
    return this.frozenScoreboard() ? 'frozen' : 'notFrozen';
  }

  updateStandings() {
    this.server.getStandings(this.id).subscribe((data: any) => {
      this.updatedStandings = Competition.parse(data.standings);
      this.updatedStandings.competidors.sort(Competidor.compare);
      // if (this.tick = !this.tick) this.updatedStandings.competidors.reverse();
      for (var i = 0; i < this.standings.competidors.length; i ++) {
        this.updatedMap[this.updatedStandings.competidors[i].id] = i;
        let oi = this.originalMap[this.updatedStandings.competidors[i].id];
        for (var j = 0; j < this.standings.problems.length; j ++) {
          this.updatedStandings.competidors[i].problemsStatus[j].firstToSolve = this.updatedStandings.competidors[i].problemsStatus[j].lastTime == this.updatedStandings.problems[j].firstSolve;
          if (this.standings.competidors[oi].problemsStatus[j].submissions < this.updatedStandings.competidors[i].problemsStatus[j].submissions) {
            this.standings.competidors[oi].problemsStatus[j].accepted = -1;
            this.standings.competidors[oi].problemsStatus[j].firstToSolve = this.updatedStandings.competidors[i].problemsStatus[j].firstToSolve;
          }
          this.standings.competidors[oi].problemsStatus[j].lastTime = this.updatedStandings.competidors[i].problemsStatus[j].lastTime;
          this.standings.competidors[oi].problemsStatus[j].submissions = this.updatedStandings.competidors[i].problemsStatus[j].submissions;
        }
      }
      this.standings.startTime = this.updatedStandings.startTime;
      this.standings.endTime = this.updatedStandings.endTime;

      this.time = new Date(data.time);
      this.progressBarValue = 100 * (this.time.getTime() - this.standings.startTime.getTime()) / (this.standings.endTime.getTime() - this.standings.startTime.getTime());
      console.log('refreshed standings');
      setTimeout(() => this.submissionAnimationEnded(), 3000);
    });
  }

  getColor(j: number) {
    if (this.standings.problems[j].color)
      return this.standings.problems[j].color;
    let value = Math.round(360 * (j / this.standings.problems.length));
    return 'hsl(' + value.toString() + ', 100%, 45%)';
  }

  getState(i: number, j: number) {
    j = j - 1;
    i = this.updatedMap[this.standings.competidors[i].id];
    if (this.updatedStandings.competidors[i].problemsStatus[j].submissions == 0)
      return 'noBalloon';
    let value = this.updatedStandings.competidors[i].problemsStatus[j].accepted ? 'fullBalloon' : ('poppedBalloon' + (this.updatedStandings.competidors[i].problemsStatus[j].submissions & 1).toString())
    return {value: value.toString(), params: {col: this.getColor(j)}};
  }

  submissionAnimationEnded() {
    for (var i = 0; i < this.standings.competidors.length; i ++) {
      let ui = this.updatedMap[this.standings.competidors[i].id];
      this.standings.competidors[i].totalTime = this.updatedStandings.competidors[ui].totalTime;
      this.standings.competidors[i].totalAccepted = this.updatedStandings.competidors[ui].totalAccepted;
      this.standings.competidors[i].problemsStatus = this.updatedStandings.competidors[ui].problemsStatus;
      this.position[i] = ui;
    }
    console.log('updated standings');
  }
}