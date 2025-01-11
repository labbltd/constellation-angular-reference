import { Component } from '@angular/core';
import { PContainerComponent } from '@typescale/angular-adapter';
import { FlowContainer } from '@typescale/dx-engine';

@Component({
  selector: 'dx-flow-container',
  template: `
    <h2>
      {{ container.getActiveViewLabel() || container.getAssignmentName() }}
    </h2>
    <ng-template
      *ngFor="let child of container.children"
      dxContainer
      [container]="child"
    ></ng-template>
    <ng-container *ngIf="container.actionButtons">
      <button
        *ngFor="let button of container.actionButtons.secondary"
        (click)="
          container.buttonClick(button).catch(handleActionError.bind(this))
        "
      >
        {{ button.name }}
      </button>
      <button
        *ngFor="let button of container.actionButtons.main"
        (click)="
          container.buttonClick(button).catch(handleActionError.bind(this))
        "
      >
        {{ button.name }}
      </button>
    </ng-container>
    <div>{{ errorMessage }}</div>
  `,
  styles: [],
})
export class FlowContainerComponent extends PContainerComponent<FlowContainer> {
  public errorMessage!: string;

  public handleActionError(e: Error) {
    console.error(e);
    this.errorMessage = e.message || 'Error';
  }
}
