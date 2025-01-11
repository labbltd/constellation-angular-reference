import { Component } from '@angular/core';
import { PContainerComponent } from '@typescale/angular-adapter';
import { PContainer } from '@typescale/dx-engine';

@Component({
  selector: 'dx-default-container',
  template: `
    <ng-container *ngFor="let child of container.children; trackBy: trackByFn">
      <ng-template dxContainer [container]="child"></ng-template>
    </ng-container>
  `,
})
export class DefaultComponent extends PContainerComponent {
  public trackByFn(index: number, item: PContainer): string {
    return item.componentName + '_' + item.id;
  }
}
