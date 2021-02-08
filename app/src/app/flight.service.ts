import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { City } from './city.service';

const GET_FLIGHTS = gql`
  query getFlights {
    flights {
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
`;
const CREATE_FLIGHT = gql`
  mutation createFlight($from: ID!, $to: ID!, $cost: Int!) {
    createFlight(to: $to, from: $from, cost: $cost) {
      id
      from {
        id
        name
      }
      to {
        id
        name
      }
      cost
    }
  }
`;
const GET_FLIGHT = gql`
  query getFlight($id: ID!) {
    flight(id: $id) {
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
`;
const UPDATE_FLIGHT = gql`
  mutation updateFlight($id: ID!, $from: ID!, $to: ID!, $cost: Int!) {
    updateFlight(id: $id, from: $from, to: $to, cost: $cost) {
      id
      from {
        id
        name
      }
      to {
        id
        name
      }
      cost
    }
  }
`;

const REMOVE_FLIGHT = gql`
  mutation deleteFlight($id: ID!) {
    removeFlight(id: $id)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private apollo: Apollo) {}

  get() {
    return this.apollo.watchQuery<QFlights, QVFlights>({
      query: GET_FLIGHTS,
    }).valueChanges;
  }

  getOne(id: string) {
    return this.apollo.watchQuery<QFlight, QVFlight>({
      query: GET_FLIGHT,
      variables: {
        id,
      },
    }).valueChanges;
  }

  create(from: string, to: string, cost: number) {
    return this.apollo.mutate<MCreateFlight, MVCreateFlight>({
      mutation: CREATE_FLIGHT,
      variables: {
        to,
        from,
        cost,
      },
      update(cache, result) {
        if (result.data && result.data.createFlight) {
          const {
            data: { createFlight: newFlight },
          } = result;
          const cached = cache.readQuery<QFlights, QVFlights>({
            query: GET_FLIGHTS,
          });
          const updatedData = { ...cached };
          console.log(updatedData, newFlight);
          updatedData.flights = [...cached.flights, newFlight];
          cache.writeQuery({
            query: GET_FLIGHTS,
            data: updatedData,
          });
        }
      },
    });
  }

  update(id: string, from: string, to: string, cost: number) {
    return this.apollo.mutate<MUpdateFlight, MVUpdateFlight>({
      mutation: UPDATE_FLIGHT,
      variables: {
        id,
        from,
        to,
        cost,
      },
      update(cache, result) {
        if (result.data && result.data.updateFlight) {
          const {
            data: { updateFlight: newFlight },
          } = result;
          const cached = cache.readQuery<QFlights, QVFlights>({
            query: GET_FLIGHTS,
          });
          const updatedData = { ...cached };
          console.log(updatedData, newFlight);
          updatedData.flights = cached.flights.map((flight) =>
            flight.id === id ? newFlight : flight
          );
          cache.writeQuery({
            query: GET_FLIGHTS,
            data: updatedData,
          });
        }
      },
    });
  }
  remove(id: string) {
    return this.apollo.mutate<MRemoveFlight, MVRemoveFlight>({
      mutation: gql`
        mutation removeFlight($id: ID!) {
          removeFlight(id: $id)
        }
      `,
      variables: {
        id,
      },
      update(cache, result) {
        if (result.data && result.data.removeFlight) {
          const cached = cache.readQuery<QFlights, QVFlights>({
            query: GET_FLIGHTS,
          });
          console.log(cached, id, result);
          const updatedData = { ...cached };
          updatedData.flights = cached.flights.filter((city) => city.id !== id);
          console.log(cached, id, result);
          cache.writeQuery({
            query: GET_FLIGHTS,
            data: updatedData,
          });
        }
      },
    });
  }
}

export interface Flight {
  id: string;
  cost: number;
  from: City;
  to: City;
}

export interface QFlights {
  flights: Flight[];
}
export interface QVFlights {}

export interface MCreateFlight {
  createFlight: Flight;
}
export interface MVCreateFlight {
  to: string;
  from: string;
  cost: number;
}

export interface QFlight {
  flight: Flight;
}
export interface QVFlight {
  id: string;
}

export interface MUpdateFlight {
  updateFlight: Flight;
}
export interface MVUpdateFlight {
  id: string;
  from: string;
  to: string;
  cost: number;
}

export interface MRemoveFlight {
  removeFlight: boolean;
}
export interface MVRemoveFlight {
  id: string;
}
