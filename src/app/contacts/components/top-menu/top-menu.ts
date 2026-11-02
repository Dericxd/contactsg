import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { PermissionService } from '../../../Services/permission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'top-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './top-menu.html',
})
export class TopMenu implements OnInit {
  authService = inject(AuthService);
  permissionService = inject(PermissionService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.permissionService.ensureLoaded().subscribe({
        error: (err) => console.error('Error al inicializar permisos del menú:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
