import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-details-container',
  template: `
    <dl>
      @for (child of container.children; track child.id) {
        <ng-container
          dxContainer
          [container]="child"
        ></ng-container>
      }
    </dl>
  `,
  standalone: false
})
export class DetailsComponent extends PContainerComponent {
}
