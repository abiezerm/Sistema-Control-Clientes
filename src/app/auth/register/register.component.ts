import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: any = {};
  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  onRegister() {
    this._authService.createAccount(this.user);
    this._authService.assignUser(this.user);
  }
}
