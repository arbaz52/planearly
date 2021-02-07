import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

export const KEY_USER = 'USER';
export const KEY_TOKEN = 'TOKEN';

@Injectable({
  providedIn: 'root',
})
export class TravelerService {
  constructor(private apollo: Apollo) {}

  signup(fullName: string, email: string, password: string) {
    return this.apollo.mutate<MRegisterTraveler, MVRegisterTraveler>({
      mutation: gql`
        mutation registerTraveler(
          $email: String!
          $password: String!
          $fullName: String!
        ) {
          registerTraveler(
            email: $email
            password: $password
            fullName: $fullName
          ) {
            id
            fullName
            email
          }
        }
      `,
      variables: {
        fullName,
        email,
        password,
      },
    });
  }

  signin(email: string, password: string) {
    return this.apollo.query<QRegisterTraveler, QVRegisterTraveler>({
      query: gql`
        query loginTraveler($email: String!, $password: String!) {
          loginTraveler(email: $email, password: $password) {
            user {
              id
              fullName
              email
            }
            token
          }
        }
      `,
      variables: {
        email,
        password,
      },
    });
  }

  toLocalStorage(user: Traveler, token: string) {
    localStorage.setItem(KEY_USER, JSON.stringify(user));
    localStorage.setItem(KEY_TOKEN, token);
  }
}

export interface Traveler {
  id: string;
  fullName: string;
  email: string;
}
interface MRegisterTraveler {
  registerTraveler: Traveler;
}
interface MVRegisterTraveler {
  email: string;
  password: string;
  fullName: string;
}

interface QRegisterTraveler {
  loginTraveler: { user: Traveler; token: string };
}
interface QVRegisterTraveler {
  email: string;
  password: string;
}
