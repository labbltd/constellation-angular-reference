import { Component, OnDestroy, OnInit } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ActionButton, Assignment } from '@labb/constellation-core-types';
import { FlowContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-flow-container',
  template: `
    <form>
      @for (message of container.config.caseMessages; track message) {
        <div>
          {{message}}
        </div>
      }
      @if (!container.hasAssignment()) {
          @for(assignment of todoAssignments; track assignment.ID) {
            <div>
              <div>{{assignment.processName}} > {{assignment.name}}</div>
              <div>Assigned to {{assignment.assigneeInfo?.name}}</div>
              <button type="button" (click)="openAssignment(assignment)">Go</button>
            </div>
          }
      } @else {
        @if (container.navigation) {
          <nav>
            <ol>
              @for (step of container.navigation.steps; track step.ID) {
                <li>{{step.name}} [{{step.visited_status}}]</li>
              }
            </ol>
          </nav>
        }
        @for (message of container.config.httpMessages; track message.message) {
          <div>
            {{message.type}}: {{message.message}}
          </div>
        }
        @for (message of container.config.pageMessages; track message.message) {
          <div>
            {{message.type}}: {{message.message}}
          </div>
        }
        <fieldset>
          <legend>
            <h2>
              {{title}}
            </h2>
          </legend>
          @for (child of container.children; track child.id) {
            <ng-container dxContainer [container]="child"/>
          }
        </fieldset>
        @if (container.actionButtons) {
          @for (button of container.actionButtons.secondary; track button.actionID) {
            <button
              type="button"
              [disabled]="loading"
              (click)="buttonClick(button)">
              {{ button.name }}
            </button>
          }
          @for (button of container.actionButtons.main; track button.actionID) {
            <button
              type="button"
              [disabled]="loading"
              (click)="buttonClick(button)">
              {{ button.name }}
            </button>
          }
        }
        <div>{{ errorMessage }}</div>
      }
    </form>
  `,
  standalone: false
})
export class FlowContainerComponent extends PContainerComponent<FlowContainer> implements OnInit, OnDestroy {
  public todoAssignments: Assignment[] = [];
  public errorMessage?: string;
  public loading = false;

  public get title(): string {
    const caseInfo = this.container.pconnect.getDataObject().caseInfo;
    const assignment = caseInfo?.assignments?.[0] as any;
    const stepName = this.container.navigation?.steps?.find(step => step.visited_status === 'current')?.name;
    if (assignment.processName === 'Booking') {
      return assignment.processName;
    }
    if (assignment?.isMultiStep === true || assignment?.isMultiStep === 'true') {
      if (assignment.name === stepName) {
        return assignment.name;
      } else {
        return assignment?.processName;
      }
    } else {
      return assignment?.name;
    }
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.updateAssignments();
    this.container.updates.subscribe(() => {
      this.updateAssignments();
    });
  }

  public openAssignment(assignment: Assignment) {
    this.container.openAssignment(assignment);
  }

  private updateAssignments(): void {
    this.todoAssignments = this.container.getTodoAssignments();
  }

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
