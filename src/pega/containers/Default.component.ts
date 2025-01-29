import { Component } from '@angular/core';
import { PContainerComponent } from '@typescale/angular-adapter';
import { PContainer } from '@typescale/dx-engine';

@Component({
  selector: 'dx-default-container',
  template: `
    <div [ngClass]="{group: container.componentName.startsWith('Group'), readOnly: container.config.readOnly}">
      <h2 *ngIf="container.config.showHeading">{{container.config.heading}}</h2>
      <span *ngIf="container.config.showLabel">{{container.config.label}}</span>
      <div *ngIf="container.config.instructions && container.config.instructions !== 'none'" [innerHtml]="container.config.instructions"></div>
      <div class="body">
        <ng-container *ngFor="let child of container.children; trackBy: trackByFn">
          <ng-template dxContainer [container]="child"></ng-template>
        </ng-container>
      </div>
    </div>
  `,
})
export class DefaultComponent extends PContainerComponent {
  public trackByFn(index: number, item: PContainer): string {
    return item.componentName + '_' + item.id;
  }
}
