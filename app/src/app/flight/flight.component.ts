import { Component, Input, OnInit } from '@angular/core';
import { Flight } from '../flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss'],
})
export class FlightComponent implements OnInit {
  @Input()
  flight: Flight;

  constructor() {}

  ngOnInit(): void {}
}
