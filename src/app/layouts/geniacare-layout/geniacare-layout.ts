import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TopMenu } from "../../contacts/components/top-menu/top-menu";


@Component({
  selector: 'geniacare-layout',
  imports: [RouterOutlet, TopMenu ],
  templateUrl: './geniacare-layout.html',
})

export class GeniacareLayout { }
