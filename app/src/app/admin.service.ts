import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { KEY_TOKEN, KEY_USER } from './traveler.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apollo: Apollo) {}
  signin(email: string, password: string) {
    return this.apollo.query<QSignin, QVSignin>({
      query: gql`
        query loginAdmin($email: String!, $password: String!) {
          loginAdmin(email: $email, password: $password) {
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

  toLocalStorage(user: Admin, token: string) {
    localStorage.setItem(KEY_USER, JSON.stringify(user));
    localStorage.setItem(KEY_TOKEN, token);
  }
}
export interface Admin {
  id: string;
  fullName: string;
  email: string;
}
interface QSignin {
  loginAdmin: {
    user: Admin;
    token: string;
  };
}

interface QVSignin {
  email: string;
  password: string;
}
