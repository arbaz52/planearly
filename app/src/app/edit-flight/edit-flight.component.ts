import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from '../city.service';
import { Flight, FlightService } from '../flight.service';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.scss'],
})
export class EditFlightComponent implements OnInit, OnChanges {
  @Input()
  cities: City[];

  @Input()
  flight: Flight;

  updateFlight: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    private router: Router
  ) {
    this.updateFlight = formBuilder.group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      cost: ['', [Validators.min(0), Validators.required]],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.flight) {
      const {
        cost,
        from: { id: from },
        to: { id: to },
      } = this.flight;
      this.updateFlight.setValue({
        from,
        to,
        cost,
      });
    }
  }

  getFrom() {
    return this.updateFlight.get('from');
  }
  getTo() {
    return this.updateFlight.get('to');
  }
  getCost() {
    return this.updateFlight.get('cost');
  }
  isInvalid() {
    return (
      this.updateFlight.invalid ||
      this.getFrom().value === this.getTo().value ||
      (this.getFrom().value === this.flight.from.id &&
        this.getTo().value === this.flight.to.id &&
        this.getCost().value === this.flight.cost)
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
    const { id } = this.flight;
    this.flightService.update(id, from, to, cost).subscribe((res) => {
      if (res && res.data) {
        console.log(res);
      }
    });
  }

  removeThis() {
    const { id } = this.flight;
    this.flightService.remove(id).subscribe((res) => {
      if (res && res.data) {
        console.log(res);
        this.router.navigate(['dashboard', 'flights']);
      }
    });
  }
}

export interface updateFlight {
  from: string;
  to: string;
  cost: number;
}
