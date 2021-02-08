import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Flight } from './flight.service';
import { v4 as uuid } from 'uuid';

const GET_CITIES = gql`
  query getCities {
    cities {
      id
      name
    }
  }
`;
const GET_CITY = gql`
  query getCity($id: ID!) {
    city(id: $id) {
      id
      name
      flightsFrom {
        id
        cost
        from {
          id
          name
        }
        to {
          id
          name
        }
      }
      flightsTo {
        id
        cost
        from {
          id
          name
        }
        to {
          id
          name
        }
      }
    }
  }
`;
const CREATE_CITY = gql`
  mutation createCity1($name: String!) {
    createCity(name: $name) {
      id
      name
    }
  }
`;
const UPDATE_CITY = gql`
  mutation updateCity($id: ID!, $name: String!) {
    updateCity(id: $id, name: $name) {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private apollo: Apollo) {}

  get() {
    return this.apollo.watchQuery<QCities, QVCities>({
      query: GET_CITIES,
    }).valueChanges;
  }
  getOne(id: string) {
    return this.apollo.watchQuery<QCity, QVCity>({
      query: GET_CITY,
      variables: {
        id,
      },
    }).valueChanges;
  }

  remove(id: string) {
    return this.apollo.mutate<MRemoveCity, MVRemoveCity>({
      mutation: gql`
        mutation removeCity($id: ID!) {
          removeCity(id: $id)
        }
      `,
      variables: {
        id,
      },
      update(cache, result) {
        if (result.data && result.data.removeCity) {
          const cached = cache.readQuery<QCities, QVCities>({
            query: GET_CITIES,
          });
          console.log(cached, id, result);
          const updatedData = { ...cached };
          updatedData.cities = cached.cities.filter((city) => city.id !== id);
          console.log(cached, id, result);
          cache.writeQuery({
            query: GET_CITIES,
            data: updatedData,
          });
        }
      },
    });
  }

  create() {
    const name = uuid();
    return this.apollo.mutate<MCreateCity, MVCreateCity>({
      mutation: CREATE_CITY,
      variables: {
        name,
      },
      update(cache, result) {
        if (result.data && result.data.createCity) {
          const {
            data: { createCity: newCity },
          } = result;
          const cached = cache.readQuery<QCities, QVCities>({
            query: GET_CITIES,
          });
          const updatedData = { ...cached };
          console.log(updatedData, newCity);
          updatedData.cities = [...cached.cities, newCity];
          cache.writeQuery({
            query: GET_CITIES,
            data: updatedData,
          });
        }
      },
    });
  }

  update(id: string, name: string) {
    return this.apollo.mutate<MUpdateCity, MVUpdateCity>({
      mutation: UPDATE_CITY,
      variables: {
        id,
        name,
      },
      update(cache, result) {
        if (result.data && result.data.updateCity) {
          const {
            data: { updateCity: newCity },
          } = result;
          const cached = cache.readQuery<QCities, QVCities>({
            query: GET_CITIES,
          });
          const updatedData = { ...cached };
          console.log(updatedData, newCity);
          updatedData.cities = cached.cities.map((city) =>
            city.id === id ? newCity : city
          );
          cache.writeQuery({
            query: GET_CITIES,
            data: updatedData,
          });
        }
      },
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

export interface CityDetails extends City {
  flightsFrom: Flight[];
  flightsTo: Flight[];
}
export interface QCity {
  city: CityDetails;
}
export interface QVCity {
  id: string;
}

export interface MRemoveCity {
  removeCity: boolean;
}
export interface MVRemoveCity {
  id: string;
}
export interface MCreateCity {
  createCity: City;
}
export interface MVCreateCity {
  name: string;
}
export interface MUpdateCity {
  updateCity: City;
}
export interface MVUpdateCity {
  id: string;
  name: string;
}
