import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, CityService } from '../city.service';
import { Plan, PlanService } from '../plan.service';

@Component({
  selector: 'app-flight-plan',
  templateUrl: './flight-plan.component.html',
  styleUrls: ['./flight-plan.component.scss'],
})
export class FlightPlanComponent implements OnInit {
  loadingCities: boolean;
  loadingPlan: boolean;

  plan: Plan;
  error: string;

  cities: City[];

  pickFlights: FormGroup;

  constructor(
    private cityService: CityService,
    private planService: PlanService,
    private formBuilder: FormBuilder
  ) {
    this.getCities();
    this.pickFlights = this.formBuilder.group({
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
    });
    console.log(this.pickFlights);
  }
  getOrigin() {
    return this.pickFlights.get('origin');
  }
  getDestination() {
    return this.pickFlights.get('destination');
  }
  isValid() {
    return this.pickFlights.valid;
  }

  getCities() {
    this.loadingCities = true;
    this.cityService.get().subscribe(
      (res) => {
        if (res.data) this.cities = res.data.cities;
        if (res.error) this.error = res.error.message;
      },
      (error) => {},
      () => {
        this.loadingCities = false;
      }
    );
  }

  getEstimatedCost() {
    if (this.plan) {
      return this.plan.routes.reduce(
        (prev, curr) => prev + curr.flight.cost,
        0
      );
    } else {
      0;
    }
  }

  handleSubmit() {
    this.error = undefined;
    this.plan = undefined;
    const [from, to] = [this.getOrigin().value, this.getDestination().value];
    this.planService.getPlan(from, to).subscribe(
      (res) => {
        if (res.data) {
          const {
            data: { generatePlan: plan },
          } = res;
          console.log(res);
          this.plan = { ...plan };
          if (plan.routes.length > 0)
            this.plan.routes = [...plan.routes].sort(
              (a, b) => a.order - b.order
            );
        }
        if (res.error) this.error = res.error.message;
      },
      (error: Error) => {
        this.error = error.message;
      }
    );
  }

  ngOnInit(): void {}
}
