import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: any = {};
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onRegister() {
    this.authService.createAccount(this.user);
    this.authService.assignUser(this.user);
  }
}
