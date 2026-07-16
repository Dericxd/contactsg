import { Component, inject, linkedSignal, signal, computed } from '@angular/core';
import { Place } from '../../../interface/place-interface';
import { UsersService } from '../../../Services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { StaffList } from '../../components/staff-list/staff-list';
import { SearchInput } from '../../components/search-input/search-input';
import { User } from '../../../models/User';

function validateQueryParam(queryParam:string){

  queryParam = queryParam.toLocaleLowerCase();

  const validPlaces: Record<string, Place> = {
    planta: 'Planta',
    tcc: 'TCC'
  }

  return validPlaces[queryParam as keyof typeof validPlaces] || 'TCC';
}

@Component({
  selector: 'place-page',
  imports: [StaffList, SearchInput],
  templateUrl: './place-page.html' 
})
export class PlacePage {

  usersServices = inject(UsersService);

  public places: Place[] = [
    'Planta',
    'TCC'
  ]

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('place') ?? '';

  selectedPlace = linkedSignal<Place>(() => validateQueryParam(this.queryParam));

  query = signal<string>('');

  selectPlace(place: Place) {
    this.selectedPlace.set(place);
    this.query.set('');
  }

  usersResource = rxResource<User[], { place: Place }>({
    params: () => ({place: this.selectedPlace()}),
    stream: ({params}): Observable<User[]> => {
      console.log({place: params.place});
      if(!params.place) return of([]);

      this.router.navigate(['/contacts/by-place'],{
        queryParams: {
          place: params.place,
        }
      });

      return this.usersServices.searchByPlace(params.place)
    }
  });

  filteredUsers = computed(() => {
    const users = this.usersResource.value() ?? [];
    const searchTerm = this.query().toLowerCase().trim();
    if (!searchTerm) return users;

    return users.filter(user => {
      const name = (user.name ?? '').toString().toLowerCase();
      const lastName = (user.last_name ?? '').toString().toLowerCase();
      const position = (user.position ?? user.cargo ?? user.posicion ?? '').toString().toLowerCase();
      const department = (user.department ?? user.departamento ?? '').toString().toLowerCase();

      return name.includes(searchTerm) ||
             lastName.includes(searchTerm) ||
             position.includes(searchTerm) ||
             department.includes(searchTerm);
    });
  });
}
