import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-one-column-template',
  template: `
      @for (child of container.children; track child.id) {
        <ng-container
          dxContainer
          [container]="child"
        ></ng-container>
      }
  `,
  standalone: false
})
export class OneColumnComponent extends PContainerComponent {}
