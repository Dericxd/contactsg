import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { UserInformation } from '../user-information/user-information';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, UserInformation],
  templateUrl: './staff-list.html',
})
export class StaffList {
  person = input.required<User[]>();
  errorMessage = input<string | unknown | null>();
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);

  // Output to notify parent page to reload data (e.g. on update/delete)
  onDataChanged = output<void>();

  selectedUser = signal<User | null>(null);

  showUser(user: User) {
    this.selectedUser.set(user);
  }

  closeModal() {
    this.selectedUser.set(null);
  }

  onUserSaved() {
    this.onDataChanged.emit();
    this.closeModal();
  }

  onUserDeleted() {
    this.onDataChanged.emit();
    this.closeModal();
  }
}
