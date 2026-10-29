import { Component, inject, linkedSignal, signal } from '@angular/core';
import { Place } from '../../../interface/place-interface';
import { UsersService } from '../../../Services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { StaffList } from '../../components/staff-list/staff-list';
import { SearchInput } from '../../components/search-input/search-input';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

function validateQueryParam(queryParam: string): Place {
  queryParam = queryParam.toLocaleLowerCase();

  const validPlaces: Record<string, Place> = {
    planta: { id: '1', name: 'Planta', status: 1 },
    tcc: { id: '2', name: 'TCC', status: 1 }
  };

  return validPlaces[queryParam as keyof typeof validPlaces] || { id: '2', name: 'TCC', status: 1 };
}

@Component({
  selector: 'place-page',
  standalone: true,
  imports: [StaffList, SearchInput, PaginationComponent],
  templateUrl: './place-page.html' 
})
export class PlacePage {
  usersServices = inject(UsersService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  public places: Place[] = [
    { id: '1', name: 'Planta', status: 1 },
    { id: '2', name: 'TCC', status: 1 }
  ];

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('place') ?? '';

  selectedPlace = linkedSignal<Place>(() => validateQueryParam(this.queryParam));
  query = signal<string>('');
  page = signal<number>(1);
  limit = signal<number>(10);

  selectPlace(place: Place): void {
    this.selectedPlace.set(place);
    this.query.set('');
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

  usersResource = rxResource({
    params: () => ({
      place: this.selectedPlace(),
      page: this.page(),
      limit: this.limit(),
      query: this.query()
    }),
    stream: ({ params }) => {
      if (!params.place) return of({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

      this.router.navigate(['/contacts/admin/by-place'], {
        queryParams: {
          place: params.place.name.toLowerCase(),
        }
      });

      return this.usersServices.searchByPlacePaginated(
        params.place,
        params.page,
        params.limit,
        params.query
      );
    }
  });

  reloadData(): void {
    this.usersServices.clearCache();
    this.usersResource.reload();
  }
}
