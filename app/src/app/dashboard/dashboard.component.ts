import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
import { City, CityDetails, CityService } from '../city.service';
import { UpdateCity } from '../edit-city/edit-city.component';
import { Flight, FlightService } from '../flight.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  entity: 'flights' | 'cities';
  id: string;
  error: string;
  loadedEntity: CityDetails | Flight;

  loadingEntity: boolean;
  removingEntity: boolean;
  updatingEntity: boolean;

  cities: City[];
  flights: Flight[];

  constructor(
    private route: ActivatedRoute,
    private cityService: CityService,
    private flightService: FlightService,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      const { entity, id } = params;
      this.entity = entity;
      this.id = id;
      if (this.entity && this.id)
        switch (this.entity) {
          case 'cities':
            this.loadingEntity = true;
            this.error = undefined;
            this.cityService.getOne(this.id).subscribe(
              (res) => {
                if (res.data) {
                  this.loadedEntity = res.data.city;
                  console.log(this.loadedEntity);
                }
                if (res.errors) {
                  this.error = res.errors[0].message;
                }
                this.loadingEntity = false;
              },
              (error: Error) => {
                this.error = error.message;
                this.loadingEntity = false;
              },
              () => {
                console.log('working');
              }
            );
            break;
          case 'flights':
            this.loadingEntity = true;
            this.error = undefined;
            this.flightService.getOne(this.id).subscribe(
              (res) => {
                if (res.data) {
                  this.loadedEntity = res.data.flight;
                  console.log(this.loadedEntity);
                }
                if (res.errors) {
                  this.error = res.errors[0].message;
                }
                this.loadingEntity = false;
              },
              (error: Error) => {
                this.error = error.message;
                this.loadingEntity = false;
              },
              () => {
                console.log('working');
              }
            );
            break;
        }
    });
  }

  ngOnInit(): void {
    this.getCities();
    this.getFlights();
    if (!this.entity) this.router.navigate(['dashboard', 'cities']);
  }
  getCities() {
    this.loadingEntity = true;
    this.error = undefined;
    this.cityService.get().subscribe(
      (res) => {
        if (res.data) this.cities = res.data.cities;
        if (res.errors) {
          this.error = res.errors[0].message;
        }
      },
      (error: Error) => {
        this.error = error.message;
      },
      () => {
        this.loadingEntity = false;
        console.log('working');
      }
    );
  }
  getFlights() {
    this.flightService.get().subscribe(
      (res) => {
        if (res.data) this.flights = res.data.flights;
        if (res.errors) {
          this.error = res.errors[0].message;
        }
        this.loadingEntity = false;
      },
      (error: Error) => {
        this.error = error.message;
        this.loadingEntity = false;
      },
      () => {
        this.loadingEntity = false;
        console.log('working');
      }
    );
  }

  newEntity() {
    switch (this.entity) {
      case 'cities':
        this.newCity();
        break;
      case 'flights':
        this.router.navigate(['dashboard', 'flights']);
        break;
    }
  }

  // event handlers for city
  newCity() {
    this.loadingEntity = true;
    this.error = undefined;
    this.cityService.create().subscribe(
      (res) => {
        if (res.data) {
          const {
            data: {
              createCity: { id },
            },
          } = res;
          this.router.navigate(['dashboard', 'cities', id]);
        }
        if (res.errors) {
          this.error = res.errors[0].message;
        }
        this.loadingEntity = false;
      },
      (error: Error) => {
        this.error = error.message;
        this.loadingEntity = false;
      },
      () => {
        this.loadingEntity = false;
        console.log('working');
      }
    );
  }
  updateCity({ id, name }: UpdateCity) {
    this.updatingEntity = true;
    this.cityService.update(id, name).subscribe((res) => {
      console.log(res);
      this.updatingEntity = false;
      // this.router.navigate(['dashboard', 'cities']);
    });
  }
  removeCity(id: string) {
    this.removingEntity = true;
    this.cityService.remove(id).subscribe((res) => {
      console.log(res);
      this.removingEntity = false;
      this.router.navigate(['dashboard', 'cities']);
    });
  }
}
