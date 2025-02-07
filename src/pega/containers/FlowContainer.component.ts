import { Component } from '@angular/core';
import { PContainerComponent } from '@typescale/angular-adapter';
import { ActionButton } from '@typescale/constellation-core-types';
import { FlowContainer } from '@typescale/dx-engine';

@Component({
  selector: 'dx-flow-container',
  template: `
    <p *ngIf="!container.hasAssignment()">
      The case has been routed succesfully
    </p>
    <ng-container *ngIf="container.hasAssignment()">
      <h2>
        {{ container.getActiveViewLabel() || container.getAssignmentName() }}
      </h2>
      <nav *ngIf="container.navigation">
        <ol>
          <li *ngFor="let step of container.navigation.steps">{{step.name}} [{{step.visited_status}}]</li>
        </ol>
      </nav>
      <ng-template
        *ngFor="let child of container.children"
        dxContainer
        [container]="child"
      ></ng-template>
      <ng-container *ngIf="container.actionButtons">
        <button
        *ngFor="let button of container.actionButtons.secondary"
          [disabled]="loading"
          (click)="buttonClick(button)">
          {{ button.name }}
        </button>
        <button
          *ngFor="let button of container.actionButtons.main"
          [disabled]="loading"
          (click)="buttonClick(button)">
          {{ button.name }}
        </button>
      </ng-container>
      <div>{{ errorMessage }}</div>
    </ng-container>
  `
})
export class FlowContainerComponent extends PContainerComponent<FlowContainer> {
  public errorMessage?: string;
  public loading = false;

  public async buttonClick(button: ActionButton): Promise<void> {
    try {
      delete this.errorMessage;
      this.loading = true;
      await this.container.buttonClick(button);
    } catch (e) {
      const error = e as { message: string; type: string };
      this.errorMessage = error?.message || error?.type || 'Error';
    }
    this.loading = false;
  }
}
