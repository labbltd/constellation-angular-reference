import { Component } from "@angular/core";
import { PContainerComponent } from "@labb/angular-adapter";
import { Default } from "@labb/dx-engine";

@Component({
  selector: 'dx-default-container',
  template: `
      @for (child of container.children; track child.id) {
        <ng-container dxContainer [container]="child"></ng-container>
      }
  `,
  standalone: false
})
export class DefaultComponent extends PContainerComponent<Default> {
}