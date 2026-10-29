import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { DepartmentService } from '../../../Services/department.service';
import { DepartmentsInterface } from '../../../interface/departments';
import { Place } from '../../../interface/place-interface';
import { SearchInput } from '../../components/search-input/search-input';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'departments-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchInput,
    PaginationComponent
  ],
  templateUrl: './departments-page.html',
})
export class DepartmentsPage implements OnInit {
  private departmentService = inject(DepartmentService);
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  // Filtros y Paginación reactiva
  query = signal<string>('');
  selectedPlaceFilter = signal<string>('todos');
  placesList = signal<Place[]>([]);
  page = signal<number>(1);
  limit = signal<number>(10);

  // Modales
  isCreateModalOpen = signal<boolean>(false);
  isEditModalOpen = signal<boolean>(false);
  selectedDepartment = signal<DepartmentsInterface | null>(null);

  // Estados de envío y mensajes
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Formulario Crear
  createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    place_id: ['', [Validators.required]],
    status: [1, [Validators.required]],
  });

  // Formulario Modificar
  editForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    place_id: ['', [Validators.required]],
    status: [1, [Validators.required]],
  });

  // Recurso paginado desde el servidor
  departmentsResource = rxResource({
    params: () => ({
      page: this.page(),
      limit: this.limit(),
      query: this.query(),
      place_id: this.selectedPlaceFilter()
    }),
    stream: ({ params }) => {
      return this.departmentService.getDepartmentsPaginated(
        params.page,
        params.limit,
        params.query,
        params.place_id
      );
    }
  });

  ngOnInit(): void {
    // Cargar sedes/lugares para los select y filtros
    this.departmentService.getPlaces().subscribe({
      next: (places) => this.placesList.set(places),
      error: (err) => console.error('Error al cargar lugares:', err)
    });
  }

  onSearch(term: string): void {
    this.query.set(term);
    this.page.set(1);
  }

  selectPlaceFilter(placeId: string): void {
    this.selectedPlaceFilter.set(placeId);
    this.page.set(1);
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
  }

  onPageSizeChange(newSize: number): void {
    this.limit.set(newSize);
    this.page.set(1);
  }

  reloadData(): void {
    this.departmentService.clearCache();
    this.departmentsResource.reload();
  }

  // --- Modal Crear ---
  openCreateModal(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.createForm.reset({
      name: '',
      place_id: '',
      status: 1
    });
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
    this.errorMessage.set(null);
  }

  onCreateSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const val = this.createForm.value;
    const newDept: DepartmentsInterface = {
      name: val.name.trim(),
      place_id: Number(val.place_id),
      status: Number(val.status)
    };

    this.departmentService.createDepartment(newDept).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeCreateModal();
        this.showSuccessToast('Departamento creado exitosamente');
        this.reloadData();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.error || err.error?.details?.sqlMessage || 'Error al crear el departamento';
        this.errorMessage.set(msg);
      }
    });
  }

  // --- Modal Modificar ---
  openEditModal(dept: DepartmentsInterface): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.selectedDepartment.set(dept);

    this.editForm.reset({
      id: dept.id,
      name: dept.name,
      place_id: dept.place_id,
      status: dept.status
    });

    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedDepartment.set(null);
    this.errorMessage.set(null);
  }

  onEditSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const dept = this.selectedDepartment();
    if (!dept || !dept.id) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const val = this.editForm.value;
    const updatedDept: DepartmentsInterface = {
      name: val.name.trim(),
      place_id: Number(val.place_id),
      status: Number(val.status)
    };

    this.departmentService.updateDepartment(dept.id, updatedDept).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeEditModal();
        this.showSuccessToast('Departamento modificado exitosamente');
        this.reloadData();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.error || err.error?.details?.sqlMessage || 'Error al modificar el departamento';
        this.errorMessage.set(msg);
      }
    });
  }

  private showSuccessToast(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => {
      this.successMessage.set(null);
    }, 4000);
  }
}
