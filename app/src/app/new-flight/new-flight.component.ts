import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from '../city.service';
import { Flight, FlightService } from '../flight.service';

@Component({
  selector: 'app-new-flight',
  templateUrl: './new-flight.component.html',
  styleUrls: ['./new-flight.component.scss'],
})
export class NewFlightComponent implements OnInit {
  @Input()
  cities: City[];

  @Input()
  flight: Flight;

  createFlight: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    private router: Router
  ) {
    this.createFlight = formBuilder.group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      cost: ['', [Validators.min(0), Validators.required]],
    });
  }

  getFrom() {
    return this.createFlight.get('from');
  }
  getTo() {
    return this.createFlight.get('to');
  }
  getCost() {
    return this.createFlight.get('cost');
  }
  isInvalid() {
    return (
      this.createFlight.invalid || this.getFrom().value === this.getTo().value
    );
  }

  ngOnInit(): void {}

  handleCreateFlight() {
    console.log('wroling');
    const [cost, from, to] = [
      this.getCost().value,
      this.getFrom().value,
      this.getTo().value,
    ];
    this.flightService.create(from, to, cost).subscribe((res) => {
      if (res && res.data) {
        console.log(res);
        this.router.navigate([
          'dashboard',
          'flights',
          res.data.createFlight.id,
        ]);
        this.createFlight.reset();
      }
    });
  }
}
