import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm;
  passwordstrength : string = '';

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn) {
      this.router.navigate(['member']);
    }
  }

  onSubmit(loginData: any) {
    // this.authService.SignUp(loginData.email, loginData.password);
    this.authService.SignIn(loginData.email, loginData.password);
  }


}
