import { Component, OnInit } from '@angular/core';
import { City, CityService } from '../city.service';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss'],
})
export class CitiesListComponent implements OnInit {
  cities: City[];
  error: string;
  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    //loading cities on mount.
    this.cityService.get().subscribe((res) => {
      if (res.data) {
        this.cities = res.data.cities;
      } else if (res.error) {
        this.error = res.error.message;
      }
    });
  }
}
