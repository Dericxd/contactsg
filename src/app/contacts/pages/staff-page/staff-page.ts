import { Component, inject, linkedSignal, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../Services/users.service';
import { AuthService } from '../../../auth/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { StaffList } from '../../components/staff-list/staff-list';
import { SearchInput } from '../../components/search-input/search-input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'staff-page',
  standalone: true,
  imports: [CommonModule, StaffList, SearchInput],
  templateUrl: './staff-page.html',
})
export class StaffPage {
  UsersService = inject(UsersService);
  authService = inject(AuthService);

  activetedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activetedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal(() => this.queryParam);
  includeDeleted = signal<boolean>(false);

  canSeeDeleted = computed(() => this.authService.canRestoreStaff());

  //? rxResource
  staffResource = rxResource({
    params: () => ({ query: this.query(), includeDeleted: this.includeDeleted() }),
    stream: ({ params }) => {
      if (!params.query) return of([]);

      this.router.navigate(['/contacts/admin/by-staff'], {
        queryParams: {
          query: params.query
        }
      });
      return this.UsersService.searchUsers(params.query, params.includeDeleted);
    } 
  });

  toggleIncludeDeleted(): void {
    this.includeDeleted.update(v => !v);
  }

  reloadData() {
    this.UsersService.clearCache();
    this.staffResource.reload();
  }
}
