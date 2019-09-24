import { Component, OnInit } from '@angular/core';
import { Competidor } from '../model/competidor';
import { RequestService } from '../service/request/request.service';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { ProblemStatus } from '../model/problem-status';
import { ActivatedRoute } from '@angular/router';
import { Competition } from '../model/competition';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {

  displayedColumns: string[] = [];
  columns: object[] = [];
  standings: Competition = new Competition(-1, '');
  id = 0;

  constructor(private server: RequestService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.server.getStandings(this.id).subscribe((data: Competition) => {
      this.standings = data;

      this.displayedColumns.push('name');
      this.columns.push({columnDef: 'name', header: 'Name', cell: (c: Competidor) => c.name});
      for (var i = 0; i < this.standings.problems.length; i ++) {
        let problemName = String.fromCharCode('A'.charCodeAt(0) + i);
        this.displayedColumns.push(problemName);
        this.columns.push({columnDef: problemName, header: problemName, cell: (c: Competidor, i: number) => ProblemStatus.toString(c.problemsStatus[i - 1])});
      }
      this.displayedColumns.push('score');
      this.columns.push({columnDef: 'score', header: 'Score', cell: (c: Competidor) => c.score});

      console.log(this.standings);
    });
  }
}