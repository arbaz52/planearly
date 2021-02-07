import { Component, OnInit } from '@angular/core';
import { KEY_TOKEN, KEY_USER } from '../traveler.service';
import jwtDecode from 'jwt-decode';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  decodedToken: Token;
  //hide nav by default for small screens.
  displayNav = false;

  constructor() {
    const token = localStorage.getItem(KEY_TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode(token) as Token;
        // token expired
        if (!decoded || decoded.exp < Date.now().valueOf() / 1000) {
          console.log(decoded.exp, Date.now().valueOf());
          this.logout();
        }
        this.decodedToken = decoded;
      } catch (ex) {
        console.log(ex);
        this.logout();
      }
    }
  }

  isLoggedIn() {
    return !!this.decodedToken;
  }
  logout() {
    console.log('logging out');
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
  }
  toggleNav() {
    this.displayNav = !this.displayNav;
  }

  ngOnInit(): void {}
}

interface Token {
  isAdmin: boolean;
  exp: number;
}
