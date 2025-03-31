import { Component, OnDestroy, OnInit } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ActionButton, Assignment } from '@labb/constellation-core-types';
import { FlowContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-flow-container',
  template: `
    <ng-container *ngIf="!container.hasAssignment()">
      <div *ngFor="let assignment of todoAssignments">
        <div>{{assignment.processName}} > {{assignment.name}}</div>
        <div>Assigned to {{assignment.assigneeInfo?.name}}</div>
        <button type="button" (click)="openAssignment(assignment)">Go</button>
      </div>
    </ng-container>
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
export class FlowContainerComponent extends PContainerComponent<FlowContainer> implements OnInit {
  public todoAssignments: Assignment[] = [];

  public override ngOnInit(): void {
    super.ngOnInit();
    this.updateAssignments();
    this.container.updates.subscribe(() => {
      this.updateAssignments();
    });
  }

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

  public openAssignment(assignment: Assignment) {
    this.container.openAssignment(assignment);
  }

  private updateAssignments(): void {
    this.todoAssignments = this.container.getTodoAssignments();
    if (this.todoAssignments.length === 1 && !this.container.hasAssignment()) {
      this.container.openAssignment(this.todoAssignments[0]);
    }
  }
}
