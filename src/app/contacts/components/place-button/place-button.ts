import { Component, inject, signal } from '@angular/core';
import { Place } from '../../../interface/place-interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { UsersService } from '../../../Services/users.service';
import { User } from '../../../models/User';

@Component({
  selector: 'place-button',
  imports: [],
  templateUrl: './place-button.html' 
})
export class PlaceButton {

  usersService = inject(UsersService);

  public places: Place[] = [
    'Planta',
    'TCC'
  ];

  selectedPlace = signal<Place | null>(null)

  selectPlace(place: Place) {
    this.selectedPlace.set(place);
  }

  usersResource = rxResource<User[], { place: Place | null }>({
    params: () => ({place: this.selectedPlace()}),
    stream: ({params}): Observable<User[]> => {
      console.log("🚀 ~ PlaceButton ~ params:", params)
      if(!params.place) return of([]);

      return this.usersService.searchByPlace(params.place);
    }
  })
}
