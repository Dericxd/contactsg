import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { UsersService } from '../../../Services/users.service';

@Component({
  selector: 'create-page',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './create-page.html',
})
export class CreatePage {
  
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  
  formUtils = FormUtils;

  // Signals to hold raw database lists
  places = signal<any[]>([]);
  departments = signal<any[]>([]);
  
  // Selected place tracking signal
  selectedPlaceId = signal<number | null>(null);

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.minLength(3)]],
    ci: ['', [Validators.required, Validators.minLength(5)]],
    position: ['', [Validators.required, Validators.minLength(3)]],
    department: ['', [Validators.required]],
    place: ['', [Validators.required]],
    local_phone: [''],
    cell_phone: [''],
  });

  constructor() {
    // 1. Fetch places and departments
    this.usersService.getPlaces().subscribe({
      next: (data) => this.places.set(data),
      error: (err) => console.error('Error loading places:', err)
    });

    this.usersService.getDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error('Error loading departments:', err)
    });

    // 2. Reactively track place changes to update selectedPlaceId and reset department
    this.myForm.get('place')?.valueChanges.subscribe((val) => {
      this.selectedPlaceId.set(val ? Number(val) : null);
      this.myForm.get('department')?.setValue('');
    });
  }

  // Reactive filtering of departments based on selected place
  filteredDepartments = computed(() => {
    const placeId = this.selectedPlaceId();
    if (!placeId) return [];
    return this.departments().filter(dept => dept.place_id === placeId);
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const val = this.myForm.value;
    const newContact = {
      name: val.name,
      last_name: val.last_name,
      ci: val.ci,
      date_in: new Date().toISOString().slice(0, 10), // Current date
      local_phone: val.local_phone || null,
      cell_phone: val.cell_phone || null,
      ext: val.local_phone || null, // local_phone mapped as ext (extension)
      department_id: Number(val.department),
      position: val.position
    };

    this.usersService.createFullContact(newContact).subscribe({
      next: (res) => {
        console.log('Contact created successfully:', res);
        alert('Contacto guardado con éxito en las tablas de users, phone_numbers y user_departments.');
        this.myForm.reset();
      },
      error: (err) => {
        console.error('Error creating contact:', err);
        const errMsg = err.error?.details?.sqlMessage || err.error?.error || err.message || 'Error desconocido';
        alert('Error al guardar el contacto: ' + errMsg);
      }
    });
  }
}
