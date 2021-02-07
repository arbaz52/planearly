import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { createHttpLink, InMemoryCache } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SvgloaderComponent } from './svgloader/svgloader.component';
import { FlightPlanComponent } from './flight-plan/flight-plan.component';
import { FooterComponent } from './footer/footer.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    SvgloaderComponent,
    FlightPlanComponent,
    FooterComponent,
    AdminLoginComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpLinkModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(apollo: Apollo) {
    apollo.create({
      link: createHttpLink({
        uri: 'http://localhost:4000/graphql',
      }),
      cache: new InMemoryCache(),
    });
  }
}
