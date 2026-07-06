import { Location } from "@angular/common";
import { ChangeDetectionStrategy ,Component, inject } from "@angular/core";


@Component({
  selector: 'not-found',
  imports: [],
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NotFound {

  location = inject(Location);

  goBack() {
    this.location.back();
  }
}
