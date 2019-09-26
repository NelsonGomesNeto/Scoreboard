import { Component, OnInit } from '@angular/core';
import { Competition } from '../model/competition';
import { RequestService } from '../service/request/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  competitions: Competition[];
  progressBars: number[];
  time: Date;

  constructor(private server: RequestService, private route: Router) { }

  ngOnInit() {
    this.server.getCompetitions().subscribe((data: any) => {
      this.competitions = new Array();
      this.progressBars = new Array();
      this.time = new Date(data.time);

      data.competitions.forEach(competition => {
        let parsed = Competition.parse(competition);
        this.competitions.push(parsed);
        this.progressBars.push(100 * (this.time.getTime() - parsed.startTime.getTime()) / (parsed.endTime.getTime() - parsed.startTime.getTime()));
      });
    });
  }

  goTo(competition: Competition) {
    this.route.navigate(['/standings/' + competition.id.toString()]);
  }
}
