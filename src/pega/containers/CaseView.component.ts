import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-case-view',
  template: `
    <ng-template
      *ngFor="let child of container.children"
      dxContainer
      [container]="child"
    ></ng-template>
  `,
})
export class CaseViewComponent extends PContainerComponent {}
