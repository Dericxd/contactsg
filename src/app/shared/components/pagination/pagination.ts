import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
})
export class PaginationComponent {
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  totalItems = input<number>(0);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([10, 25, 50]);

  pageChange = output<number>();
  pageSizeChange = output<number>();

  startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endItem = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  });

  // Genera los números de página visibles (hasta 5 páginas con ventana deslizante)
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 1) return [1];

    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = Number(target.value);
    if (newSize && newSize !== this.pageSize()) {
      this.pageSizeChange.emit(newSize);
    }
  }
}
