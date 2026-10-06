import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { UsersService } from '../../../Services/users.service';

import { CommonModule } from '@angular/common';
import { Place } from '../../../interface/place-interface';
import { DepartmentsInterface } from '../../../interface/departments';
import { CompanyLineInterface } from '../../../interface/company-line-interface';

@Component({
  selector: 'create-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-page.html',
})
export class CreatePage implements OnInit {
  
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  
  formUtils = FormUtils;

  // Signals to hold raw database lists
  places = signal<Place[]>([]);
  departments = signal<DepartmentsInterface[]>([]);
  companyLines = signal<CompanyLineInterface[]>([]);
  
  // Selected place tracking signal
  selectedPlaceId = signal<number | null>(null);

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    username: ['', [Validators.minLength(3)]],
    password: ['', [Validators.minLength(4)]],
    document_type: ['V', [Validators.required]],
    document_number: ['', [Validators.required, Validators.minLength(5)]],
    position: ['', [Validators.required, Validators.minLength(3)]],
    department: [{ value: '', disabled: true }, [Validators.required]],
    place: ['', [Validators.required]],
    local_phone: [''],
    phone_number: [''],
  });

  ngOnInit() {
    console.log('CreatePage ngOnInit initialized');
    
    // 1. Fetch places and departments
    this.usersService.getPlaces().subscribe({
      next: (data) => {
        //console.log('Places fetched successfully:', data);
        this.places.set(data);
      },
      error: (err) => console.error('Error loading places:', err)
    });

    this.usersService.getDepartments().subscribe({
      next: (data) => {
        //console.log('Departments fetched successfully:', data);
        this.departments.set(data);
      },
      error: (err) => console.error('Error loading departments:', err)
    });

    this.usersService.getCompanyLinesAvailable().subscribe({
      next: (data) => {
        //console.log('Company lines fetched successfully:', data);
        this.companyLines.set(data);
      },
      error: (err) => console.error('Error loading company lines:', err)
    });

    // 2. Reactively track place changes to update selectedPlaceId and reset department
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
      document_type: val.document_type,
      document_number: val.document_number,
      email: val.email || null,
      username: val.username || null,
      password: val.password || null,
      date_in: new Date().toISOString().slice(0, 10) || null, // Current date
      local_phone: val.local_phone || null,
      cell_phone: val.phone_number ? Number(val.phone_number) : null, // send line_id as cell_phone
      ext: val.local_phone || null, // local_phone mapped as ext (extension)
      department_id: Number(val.department),
      position: val.position || ''
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
