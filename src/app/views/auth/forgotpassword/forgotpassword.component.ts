import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html'
})
export class ForgotpasswordComponent implements OnInit {

  loginForm;
  passwordstrength : string = '';

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {

    if(this.authService.isLoggedIn) {
      this.router.navigate(['admin']);
    }

  }

  onSubmit(loginData: any) {
    this.authService.ForgotPassword(loginData.email);
  }


}
