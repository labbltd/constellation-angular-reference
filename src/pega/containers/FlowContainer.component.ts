import { Component, OnInit } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ActionButton, Assignment } from '@labb/constellation-core-types';
import { FlowContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-flow-container',
  template: `
    @if (!container.hasAssignment()) {
      @for (assignment of todoAssignments; track assignment.ID) {
        <div>
          <div>{{assignment.processName}} > {{assignment.name}}</div>
          <div>Assigned to {{assignment.assigneeInfo?.name}}</div>
          <button type="button" (click)="openAssignment(assignment)">Go</button>
        </div>
      }
    }
    @if (container.hasAssignment()) {
      <h2>
        {{ container.getActiveViewLabel() || container.getAssignmentName() }}
      </h2>
      @if (container.navigation) {
        <nav>
          <ol>
            @for (step of container.navigation.steps; track step.ID) {
              <li>{{step.name}} [{{step.visited_status}}]</li>
            }
          </ol>
        </nav>
      }
      @for (child of container.children; track child.id) {
        <ng-container
          dxContainer
          [container]="child"
        ></ng-container>
      }
      @if (container.actionButtons) {
        @for (button of container.actionButtons.secondary; track button.actionID) {
          <button
            [disabled]="loading"
            (click)="buttonClick(button)">
            {{ button.name }}
          </button>
        }
        @for (button of container.actionButtons.main; track button.actionID) {
          <button
            [disabled]="loading"
            (click)="buttonClick(button)">
            {{ button.name }}
          </button>
        }
      }
      <div>{{ errorMessage }}</div>
    }
  `,
  standalone: false
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
  }
}
