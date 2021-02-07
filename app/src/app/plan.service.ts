import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { City } from './city.service';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private apollo: Apollo) {}

  getPlan(from: string, to: string) {
    return this.apollo.query<QPath, QVPath>({
      query: gql`
        query getPath($from: ID!, $to: ID!) {
          generatePlan(from: $from, to: $to) {
            id
            from {
              id
              name
            }
            to {
              id
              name
            }
            routes {
              id

              order
              flight {
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
          }
        }
      `,
      variables: {
        from,
        to,
      },
    });
  }
}

interface Flight {
  id: string;
  from: City;
  to: City;
  cost: number;
}
interface Route {
  id: string;
  order: number;
  flight: Flight;
}
export interface Plan {
  id: string;
  from: City;
  to: City;
  routes: Route[];
}

interface QPath {
  generatePlan: Plan;
}
interface QVPath {
  from: string;
  to: string;
}
