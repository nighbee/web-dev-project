import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  isRegister = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.error.set('Username and password are required');
      return;
    }
    this.error.set('');
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/videos']),
      error: (err) => this.error.set(err.message)
    });
  }

  toggleMode() {
    this.isRegister.update(v => !v);
    this.error.set('');
  }
}
