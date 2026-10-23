import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = signal<string | null>(null);

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage.set('Por favor, ingresa usuario y contraseña');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.errorMessage.set(null);
        this.router.navigate(['/contacts/admin/by-staff']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Error al iniciar sesión');
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
