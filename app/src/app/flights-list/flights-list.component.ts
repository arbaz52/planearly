import { Component, Input, OnInit } from '@angular/core';
import { Flight } from '../flight.service';

@Component({
  selector: 'app-flights-list',
  templateUrl: './flights-list.component.html',
  styleUrls: ['./flights-list.component.scss'],
})
export class FlightsListComponent implements OnInit {
  @Input()
  flights: Flight[];

  constructor() {}
  ngOnInit(): void {}
}
