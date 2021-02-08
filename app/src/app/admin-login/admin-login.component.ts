import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin, AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  submitting: boolean;
  error: string;
  data: Admin;

  signIn: FormGroup;

  constructor(
    private adminService: AdminService,
    formBuilder: FormBuilder,
    private router: Router
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
    this.adminService.signin(email, password).subscribe(
      (ob) => {
        if (ob.data) {
          console.log(ob.data);
          this.data = ob.data.loginAdmin.user;
          const {
            loginAdmin: { token, user },
          } = ob.data;
          this.adminService.toLocalStorage(user, token);
          this.router.navigate(['/dashboard']);
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
