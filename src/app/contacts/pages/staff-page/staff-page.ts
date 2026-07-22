import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../Services/users.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { StaffList } from '../../components/staff-list/staff-list';
import { SearchInput } from '../../components/search-input/search-input';

@Component({
  selector: 'staff-page',
  standalone: true,
  imports: [StaffList, SearchInput],
  templateUrl: './staff-page.html',
})
export class StaffPage {
  UsersService = inject(UsersService);

  activetedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activetedRoute.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(() => this.queryParam);

  //? rxResource
  staffResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({params}) => {
      if (!params.query) return of([]);

      this.router.navigate(['/contacts/by-staff'], {
        queryParams: {
          query: params.query
        }
      });
      return this.UsersService.searchUsers(params.query);
    } 
  });

  reloadData() {
    this.UsersService.clearCache();
    this.staffResource.reload();
  }
}
