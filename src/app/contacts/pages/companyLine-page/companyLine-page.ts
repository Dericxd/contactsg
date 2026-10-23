import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CompanyLine } from '../../../Services/company-line.service';
import { CompanyLineInterface } from '../../../interface/company-line-interface';
import { SearchInput } from '../../components/search-input/search-input';

@Component({
  selector: 'company-line-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SearchInput,
    TitleCasePipe,
    DatePipe
  ],
  templateUrl: './companyLine-page.html',
})
export class CompanyLinePage {
  private companyLineService = inject(CompanyLine);

  operators: string[] = ['todos', 'movistar', 'digitel', 'movilnet'];
  selectedOperator = signal<string>('todos');

  query = signal<string>('');

  linesResource = rxResource<CompanyLineInterface[], unknown>({
    stream: () => this.companyLineService.getCompanyLines()
  });

  filteredLines = computed(() => {
    const lines = this.linesResource.value() ?? [];
    const op = this.selectedOperator().toLowerCase();
    const q = this.query().toLowerCase().trim();

    return lines.filter(line => {
      // Filtrar por operador
      if (op !== 'todos' && (line.operator ?? '').toLowerCase() !== op) {
        return false;
      }

      // Filtrar por texto de búsqueda
      if (!q) return true;

      const phone = (line.phone_number ?? '').toLowerCase();
      const serial = (line.serial ?? '').toLowerCase();
      const operator = (line.operator ?? '').toLowerCase();
      const status = (line.status ?? '').toLowerCase();
      const activeStatus = (line.active_status ?? '').toLowerCase();
      const user = (line.assigned_user ?? `${line.user_name ?? ''} ${line.user_last_name ?? ''}`).toLowerCase();

      return phone.includes(q) ||
             serial.includes(q) ||
             operator.includes(q) ||
             status.includes(q) ||
             activeStatus.includes(q) ||
             user.includes(q);
    });
  });

  selectOperator(op: string) {
    this.selectedOperator.set(op);
  }

  reloadData() {
    this.companyLineService.clearCache();
    this.linesResource.reload();
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
