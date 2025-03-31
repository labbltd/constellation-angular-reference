import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-details-container',
  template: `
    <dl>
      <ng-container *ngFor="let child of container.children" dxContainer [container]="child"></ng-container>
    </dl>
  `,
})
export class DetailsComponent extends PContainerComponent {
}
