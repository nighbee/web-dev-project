import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';
  errorMessage = '';
  isRegisterMode = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/videos']),
      error: (err) => this.errorMessage = err.message
    });
  }

  register() {
    this.errorMessage = '';
    this.auth.register(this.username, this.password, this.email).subscribe({
      next: () => {
        this.auth.login(this.username, this.password).subscribe({
          next: () => this.router.navigate(['/videos']),
          error: (err) => this.errorMessage = err.message
        });
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }
}
