import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private apollo: Apollo) {}

  get() {
    return this.apollo.query<QCities, QVCities>({
      query: gql`
        query getCities {
          cities {
            id
            name
          }
        }
      `,
    });
  }
}

export interface City {
  id: string;
  name: string;
}

export interface QCities {
  cities: City[];
}
export interface QVCities {}
