import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client/core';
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
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { CitiesListComponent } from './cities-list/cities-list.component';
import { FlightsListComponent } from './flights-list/flights-list.component';
import { PickEntityComponent } from './pick-entity/pick-entity.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { FlightComponent } from './flight/flight.component';
import { setContext } from '@apollo/client/link/context';
import { KEY_TOKEN } from './traveler.service';
import { EditFlightComponent } from './edit-flight/edit-flight.component';
import { NewFlightComponent } from './new-flight/new-flight.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    SvgloaderComponent,
    FlightPlanComponent,
    AdminLoginComponent,
    NotFoundComponent,
    DashboardComponent,
    CitiesListComponent,
    FlightsListComponent,
    PickEntityComponent,
    EditCityComponent,
    FlightComponent,
    EditFlightComponent,
    NewFlightComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpLinkModule,
    ReactiveFormsModule,
    InlineSVGModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(apollo: Apollo) {
    const auth = setContext((operation, context) => {
      const token = localStorage.getItem(KEY_TOKEN);
      if (token === null) {
        return {};
      } else {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }
    });
    const link = ApolloLink.from([
      auth,
      createHttpLink({
        uri: `http://${window.location.hostname}:4000/graphql`,
      }),
    ]);
    apollo.create({
      link,
      cache: new InMemoryCache(),
    });
  }
}
