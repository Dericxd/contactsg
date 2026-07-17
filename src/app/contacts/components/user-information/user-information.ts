import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/User';
import { UsersService } from '../../../Services/users.service';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-information.html'
})
export class UserInformation {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);

  user = input.required<any>();
  onSaved = output<void>();
  onDeleted = output<void>();
  onClose = output<void>();

  isEditing = signal<boolean>(false);
  places = signal<any[]>([]);
  departments = signal<any[]>([]);
  selectedPlaceId = signal<number | null>(null);
  public formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.minLength(3)]],
    ci: ['', [Validators.required, Validators.minLength(5)]],
    position: ['', [Validators.required, Validators.minLength(3)]],
    department: [{ value: '', disabled: true }, [Validators.required]],
    place: ['', [Validators.required]],
    local_phone: [''],
    cell_phone: [''],
  });

  filteredDepartments = computed(() => {
    const placeId = this.selectedPlaceId();
    if (!placeId) return [];
    return this.departments().filter(dept => dept.place_id === placeId);
  });

  constructor() {
    this.usersService.getPlaces().subscribe({
      next: (data) => this.places.set(data),
      error: (err) => console.error('Error loading places:', err)
    });

    this.usersService.getDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error('Error loading departments:', err)
    });

    this.myForm.get('place')?.valueChanges.subscribe((val) => {
      const placeId = val ? Number(val) : null;
      this.selectedPlaceId.set(placeId);
      
      const deptControl = this.myForm.get('department');
      if (placeId) {
        deptControl?.enable();
      } else {
        deptControl?.disable();
      }
      deptControl?.setValue('');
    });
  }

  enterEditMode() {
    const u = this.user();
    const matchedDept = this.departments().find(
      (d) => d.name === u.department || d.name === u.departamento
    );
    const placeId = matchedDept ? matchedDept.place_id : null;
    const deptId = matchedDept ? matchedDept.id : '';

    this.selectedPlaceId.set(placeId);

    const deptControl = this.myForm.get('department');
    if (placeId) {
      deptControl?.enable({ emitEvent: false });
    } else {
      deptControl?.disable({ emitEvent: false });
    }

    // Disable event emission temporarily to prevent clearing the department control
    this.myForm.get('place')?.setValue(placeId || '', { emitEvent: false });
    this.myForm.get('department')?.setValue(deptId || '', { emitEvent: false });

    this.myForm.patchValue({
      name: u.name,
      last_name: u.last_name,
      ci: u.ci,
      position: u.position || u.cargo || u.posicion || '',
      local_phone: u.local_phone || u.telefono_local || '',
      cell_phone: u.cell_phone || u.telefono_personal || '',
    });

    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  saveUpdate() {
    if (this.myForm.invalid) {
      console.warn('Form validation failed:');
      Object.keys(this.myForm.controls).forEach(key => {
        const controlErrors = this.myForm.get(key)?.errors;
        if (controlErrors != null) {
          console.warn(`Control "${key}" has errors:`, controlErrors);
        }
      });
      this.myForm.markAllAsTouched();
      return;
    }

    const val = this.myForm.getRawValue();
    let formattedDate = new Date().toISOString().slice(0, 10);
    if (this.user().date_in) {
      try {
        formattedDate = new Date(this.user().date_in).toISOString().slice(0, 10);
      } catch (e) {
        console.error('Error parsing date_in:', e);
      }
    }

    const updatePayload = {
      name: val.name,
      last_name: val.last_name,
      ci: val.ci,
      date_in: formattedDate,
      local_phone: val.local_phone || null,
      cell_phone: val.cell_phone || null,
      ext: val.local_phone || null,
      department_id: Number(val.department),
      position: val.position
    };

    const id = this.user().id!;
    this.usersService.updateFullContact(id, updatePayload).subscribe({
      next: () => {
        alert('Contacto actualizado con éxito.');
        this.isEditing.set(false);
        this.onSaved.emit();
      },
      error: (err) => {
        console.error('Error updating contact:', err);
        const errMsg = err.error?.details?.sqlMessage || err.error?.error || err.message || 'Error desconocido';
        alert('Error al actualizar el contacto: ' + errMsg);
      }
    });
  }

  deleteUser() {
    if (!confirm(`¿Está seguro que desea eliminar a ${this.user().name} ${this.user().last_name}?`)) {
      return;
    }

    const id = this.user().id!;
    this.usersService.deleteUser(id).subscribe({
      next: () => {
        alert('Contacto eliminado con éxito.');
        this.onDeleted.emit();
      },
      error: (err) => {
        console.error('Error deleting contact:', err);
        alert('Error al eliminar el contacto.');
      }
    });
  }
}
