import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { CompanyLine } from '../../../Services/company-line.service';
import { CompanyLineInterface } from '../../../interface/company-line-interface';
import { SearchInput } from '../../components/search-input/search-input';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { AuthService } from '../../../auth/auth.service';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'company-line-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    SearchInput,
    PaginationComponent
  ],
  templateUrl: './companyLine-page.html',
})
export class CompanyLinePage {
  private companyLineService = inject(CompanyLine);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  formUtils = FormUtils;

  operators: string[] = ['todos', 'movistar', 'digitel', 'movilnet'];
  selectedOperator = signal<string>('todos');
  query = signal<string>('');
  page = signal<number>(1);
  limit = signal<number>(10);

  // Estados del modal de edición
  isEditModalOpen = signal<boolean>(false);
  selectedLine = signal<CompanyLineInterface | null>(null);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Formulario reactivo para modificar línea
  editForm: FormGroup = this.fb.group({
    id: [null],
    serial: ['', [Validators.required, Validators.maxLength(100)]],
    phone_number: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    operator: ['', [Validators.required]],
    status: ['disponible', [Validators.required]],
    active_status: ['activa', [Validators.required]],
  });

  linesResource = rxResource({
    params: () => ({
      page: this.page(),
      limit: this.limit(),
      operator: this.selectedOperator(),
      query: this.query()
    }),
    stream: ({ params }) => {
      return this.companyLineService.getCompanyLinesPaginated(
        params.page,
        params.limit,
        params.operator,
        params.query
      );
    }
  });

  selectOperator(op: string): void {
    this.selectedOperator.set(op);
    this.page.set(1);
  }

  onSearch(term: string): void {
    this.query.set(term);
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
    this.companyLineService.clearCache();
    this.linesResource.reload();
  }

  // --- Modal Modificar ---
  openEditModal(line: CompanyLineInterface): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.selectedLine.set(line);

    this.editForm.reset({
      id: line.id,
      serial: line.serial ?? '',
      phone_number: line.phone_number ?? '',
      operator: (line.operator ?? '').toLowerCase(),
      status: (line.status ?? 'disponible').toLowerCase(),
      active_status: (line.active_status ?? 'activa').toLowerCase(),
    });

    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedLine.set(null);
    this.errorMessage.set(null);
  }

  onEditSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const currentLine = this.selectedLine();
    if (!currentLine || !currentLine.id) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const val = this.editForm.value;
    const updatedLine: CompanyLineInterface = {
      serial: val.serial.trim(),
      phone_number: val.phone_number.trim(),
      operator: val.operator,
      status: val.status,
      active_status: val.active_status,
    };

    this.companyLineService.updateCompanyLine(currentLine.id, updatedLine).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeEditModal();
        this.showSuccessToast('Línea corporativa actualizada con éxito');
        this.reloadData();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.error || err.error?.details?.sqlMessage || 'Error al actualizar la línea corporativa';
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

  getOperatorBadgeClass(operator: string): string {
    const op = (operator ?? '').toLowerCase();
    switch (op) {
      case 'movistar':
        return 'badge-info text-white';
      case 'digitel':
        return 'badge-primary text-white';
      case 'movilnet':
        return 'badge-secondary text-white';
      default:
        return 'badge-ghost';
    }
  }
}
