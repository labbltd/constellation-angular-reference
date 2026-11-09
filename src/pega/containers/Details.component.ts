import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-details-container',
  template: `
    <div data-columns="1">
      @for (child of container.children; track child.id) {
        <ng-container dxContainer [container]="child"/>
      }
    </div>
  `,
  standalone: false
})
export class DetailsComponent extends PContainerComponent {
}
