import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, CityService } from '../city.service';

@Component({
  selector: 'app-flight-plan',
  templateUrl: './flight-plan.component.html',
  styleUrls: ['./flight-plan.component.scss'],
})
export class FlightPlanComponent implements OnInit {
  loadingCities: boolean;
  cities: City[];

  error: string;

  pickFlights: FormGroup;

  constructor(
    private cityService: CityService,
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

  ngOnInit(): void {}
}
