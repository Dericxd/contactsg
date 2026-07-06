import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'staff-page',
  imports: [],
  templateUrl: './staff-page.html',
})

export class StaffPage {

  //? variable de para mostrar los contacto o los usuario
  // staff = inject(StaffService).getStaff();

  // activedRoute = inject(ActivatedRoute);
  // router = inject(Router);

  // queryParam = this.activedRoute.snapshot.queryParamMap.get('query') ?? '';

  // query = linkedSignal(() => this.queryParam);

  isLoading = signal(false);
  // isError = signal<string | null>(null);
  // test de prueba
  test = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Brown' },
    { id: 5, name: 'Charlie Davis' },
    { id: 6, name: 'Emily Wilson' },
    { id: 7, name: 'Frank Miller' },
    { id: 8, name: 'Grace Lee' },
    { id: 9, name: 'Henry Clark' },
    { id: 10, name: 'Isabella Martinez' }
  ];
  // staffs = signal<test[]>(this.test);




}
function signal(arg0: boolean) {
  throw new Error('Function not implemented.');
}

