import { Component, inject } from '@angular/core';
import { NotFound } from '../../../shared/components/not-found/not-found';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../Services/users.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-genia-page',
  imports: [NotFound],
  templateUrl: './genia-page.html',
})
export class GeniaPage {

  nameStaff = inject(ActivatedRoute).snapshot.params['query'] ?? '';
  userService = inject(UsersService);

  //? rxResource version
  staffResource = rxResource({
    params: () => ({ query: this.nameStaff }),
    stream: ({params}) => {
      if (!params.query) throw new Error('Query parameter is required');
      return this.userService.searchUsers(params.query);
    }
  })
}
