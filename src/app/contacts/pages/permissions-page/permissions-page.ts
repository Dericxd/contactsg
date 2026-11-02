import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../../Services/permission.service';
import {
  AdminUser,
  MatrixModule,
  PermissionChange,
  PermissionEffect,
  UserPermissionMatrix
} from '../../../interface/permission-interface';

@Component({
  selector: 'app-permissions-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './permissions-page.html'
})
export class PermissionsPage implements OnInit {
  private permissionService = inject(PermissionService);

  // Lista de usuarios y búsqueda
  usersList = signal<AdminUser[]>([]);
  searchUser = signal<string>('');
  isLoadingUsers = signal<boolean>(false);

  // Usuario seleccionado y su matriz
  selectedUser = signal<AdminUser | null>(null);
  matrix = signal<UserPermissionMatrix | null>(null);
  isLoadingMatrix = signal<boolean>(false);

  // Cambios pendientes: permission_id -> effect ('grant' | 'revoke' | null)
  pendingChanges = signal<Map<number, PermissionEffect>>(new Map());

  // Estado de guardado y feedback
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Usuarios filtrados por término de búsqueda
  filteredUsers = computed(() => {
    const q = this.searchUser().trim().toLowerCase();
    if (!q) return this.usersList();
    return this.usersList().filter((u) => {
      const full = `${u.name} ${u.last_name}`.toLowerCase();
      return full.includes(q) || (u.username && u.username.toLowerCase().includes(q));
    });
  });

  // Cantidad de modificaciones pendientes
  pendingChangesCount = computed(() => this.pendingChanges().size);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.permissionService.getAdminUsers().subscribe({
      next: (users) => {
        this.usersList.set(users);
        this.isLoadingUsers.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoadingUsers.set(false);
        this.errorMessage.set('Error al cargar lista de usuarios');
      }
    });
  }

  onSelectUser(user: AdminUser): void {
    if (user.is_admin) return;

    if (this.pendingChangesCount() > 0) {
      const confirmDiscard = confirm('Tienes cambios sin guardar para este usuario. ¿Deseas descartarlos y cambiar de usuario?');
      if (!confirmDiscard) return;
    }

    this.selectedUser.set(user);
    this.pendingChanges.set(new Map());
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.loadUserMatrix(user.id);
  }

  loadUserMatrix(userId: number): void {
    this.isLoadingMatrix.set(true);
    this.permissionService.getUserPermissionMatrix(userId).subscribe({
      next: (data) => {
        this.matrix.set(data);
        this.isLoadingMatrix.set(false);
      },
      error: (err) => {
        console.error('Error al cargar matriz:', err);
        this.isLoadingMatrix.set(false);
        this.errorMessage.set('Error al cargar matriz de permisos del usuario');
      }
    });
  }

  /**
   * Obtiene el efecto actual de un permiso considerando los cambios pendientes.
   */
  getEffect(permissionId: number, originalEffect: PermissionEffect): PermissionEffect {
    const changes = this.pendingChanges();
    if (changes.has(permissionId)) {
      return changes.get(permissionId)!;
    }
    return originalEffect;
  }

  /**
   * Modifica el efecto de un permiso.
   */
  setEffect(permissionId: number, originalEffect: PermissionEffect, newEffect: PermissionEffect): void {
    const changes = new Map(this.pendingChanges());

    if (newEffect === originalEffect) {
      changes.delete(permissionId);
    } else {
      changes.set(permissionId, newEffect);
    }

    this.pendingChanges.set(changes);
  }

  /**
   * Calcula si el permiso resultará concedido de manera efectiva en tiempo real.
   */
  computeEffective(fromRole: boolean, effect: PermissionEffect, adminOnly: boolean): boolean {
    if (adminOnly) return false;
    if (effect === 'revoke') return false;
    if (effect === 'grant') return true;
    return fromRole;
  }

  discardChanges(): void {
    this.pendingChanges.set(new Map());
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  saveChanges(): void {
    const user = this.selectedUser();
    if (!user) return;

    const changesMap = this.pendingChanges();
    if (changesMap.size === 0) return;

    const changesList: PermissionChange[] = [];
    for (const [permission_id, effect] of changesMap.entries()) {
      changesList.push({ permission_id, effect });
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.permissionService.saveUserPermissions(user.id, changesList).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.pendingChanges.set(new Map());
        this.matrix.set(res);
        this.successMessage.set(`Permisos de ${user.name} actualizados exitosamente (${changesList.length} cambios).`);
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Error al guardar permisos:', err);
        const msg = err.error?.error || 'Error al guardar permisos';
        this.errorMessage.set(msg);
      }
    });
  }
}
