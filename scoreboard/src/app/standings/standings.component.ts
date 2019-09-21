import { Component, OnInit } from '@angular/core';
import { Competidor } from '../model/competidor';
import { RequestService } from '../request.service';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { ProblemStatus } from '../model/problem-status';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {

  displayedColumns: string[] = [];
  columns: object[] = [];
  standings: Competidor[];

  constructor(private server: RequestService) {
  }

  ngOnInit() {
    this.server.getStandings().subscribe((data: Competidor[]) => {

      this.standings = data;

      this.displayedColumns.push('name');
      this.columns.push({columnDef: 'name', header: 'Name', cell: (c: Competidor) => c.name});
      for (var i = 0; i < this.standings[0].problems.length; i ++) {
        let problemName = String.fromCharCode('A'.charCodeAt(0) + i);
        this.displayedColumns.push(problemName);
        this.columns.push({columnDef: problemName, header: problemName, cell: (c: Competidor, i) => ProblemStatus.toString(c.problems[i - 1])});
      }
      this.displayedColumns.push('score');
      this.columns.push({columnDef: 'score', header: 'Score', cell: (c: Competidor) => c.score});

      console.log(this.standings);
    });
  }
}

export class StandingsDataSource extends DataSource<any> {
  constructor(private server: RequestService) {
    super();
  }
  connect(): Observable<any> {
    console.log("connecting");
    return this.server.getStandings();
  }
  disconnect() {}
}