import { Component, OnInit } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { PContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-details-container',
  template: `
    <ng-container *ngFor="let child of container.children; trackBy: trackByFn">
      <ng-template dxContainer [container]="child"></ng-template>
    </ng-container>
  `,
})
export class DetailsComponent extends PContainerComponent implements OnInit {
  public renderCount = 0;

  public ngOnInit(): void {
    this.container.updates.subscribe(() => {
      console.log(this.container.children.length);
      this.renderCount++;
    });
  }

  public trackByFn(index: number, item: PContainer): string {
    return item.componentName + '_' + item.id;
  }
}
