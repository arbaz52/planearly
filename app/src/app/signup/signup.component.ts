import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Traveler, TravelerService } from '../traveler.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  submitting: boolean;
  error: string;
  data: Traveler;

  signUp: FormGroup;

  constructor(
    private travelerService: TravelerService,
    formBuilder: FormBuilder
  ) {
    this.signUp = formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  getFullName() {
    return this.signUp.get('fullName');
  }
  getEmail() {
    return this.signUp.get('email');
  }
  getPassword() {
    return this.signUp.get('password');
  }

  isFullNameInvalid() {
    return this.getFullName().invalid && this.getFullName().touched;
  }

  isEmailInvalid() {
    return this.getEmail().invalid && this.getEmail().touched;
  }
  isPasswordInvalid() {
    return this.getPassword().invalid && this.getPassword().touched;
  }

  isValid() {
    console.log(this.signUp.valid);
    return this.signUp.valid;
  }

  async handleSubmit() {
    this.submitting = true;
    this.error = undefined;
    this.data = undefined;
    const [fullName, email, password] = [
      this.getFullName().value,
      this.getEmail().value,
      this.getPassword().value,
    ];
    this.travelerService.signup(fullName, email, password).subscribe(
      (ob) => {
        if (ob.data) {
          this.data = ob.data.registerTraveler;
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
