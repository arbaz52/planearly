import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Traveler, TravelerService } from '../traveler.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  submitting: boolean;
  error: string;
  data: Traveler;

  signIn: FormGroup;

  constructor(
    private travelerService: TravelerService,
    formBuilder: FormBuilder
  ) {
    this.signIn = formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  getEmail() {
    return this.signIn.get('email');
  }
  getPassword() {
    return this.signIn.get('password');
  }

  isEmailInvalid() {
    return this.getEmail().invalid && this.getEmail().touched;
  }
  isPasswordInvalid() {
    return this.getPassword().invalid && this.getPassword().touched;
  }

  isValid() {
    console.log(this.signIn.valid);
    return this.signIn.valid;
  }

  async handleSubmit() {
    this.submitting = true;
    this.error = undefined;
    this.data = undefined;
    const [email, password] = [this.getEmail().value, this.getPassword().value];
    this.travelerService.signin(email, password).subscribe(
      (ob) => {
        if (ob.data) {
          console.log(ob.data);
          this.data = ob.data.loginTraveler.user;
          const {
            loginTraveler: { token, user },
          } = ob.data;
          this.travelerService.toLocalStorage(user, token);
        }
        if (ob.errors) {
          this.error = ob.errors[0].message;
        }
        this.submitting = false;
      },
      (error: Error) => {
        this.error = error.message;
        this.submitting = false;
      }
    );
  }

  ngOnInit(): void {}
}
