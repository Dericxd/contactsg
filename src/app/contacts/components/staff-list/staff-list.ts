import { Component, input } from '@angular/core';
import { User } from '../../../models/User';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  imports: [RouterLink],
  templateUrl: './staff-list.html',
})
export class StaffList {

  person = input.required<User[]>();

  errorMessage = input<string | unknown | null>();
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);
}
