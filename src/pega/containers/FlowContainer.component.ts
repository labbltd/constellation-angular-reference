import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ActionButton } from '@labb/constellation-core-types';
import { FlowContainer, TodoItem } from '@labb/dx-engine';

/**
 * Html-only mapping of the dx-engine FlowContainer.
 *
 * All decisions (which branch to render, to-do items, labels, get-next-work, error state)
 * are made by the dx-engine container; this component only renders them. The branches
 * follow Pega's cosmos-dxcomponents Flow container:
 * - 'confirm': the confirmation view, without form or action buttons;
 * - 'todo':    the list of to-do assignments;
 * - 'form':    the assignment form with messages, navigation and action buttons;
 * - 'none':    nothing.
 */
@Component({
  selector: 'dx-flow-container',
  template: `
    @for (message of container.config.caseMessages; track message) {
      <p role="status">{{ message }}</p>
    }

    @if (showGetNextWork) {
      <div role="status">
        <p>Your work on this item is complete.</p>
        <menu>
          <li><button type="button" [disabled]="loading" (click)="getNextWork()">Get next work</button></li>
          <li><button type="button" (click)="nextWorkDismissed = true">Dismiss</button></li>
        </menu>
      </div>
    }

    @if (container.renderMode === 'form' || container.renderMode === 'confirm') {
      @if (hasMessages) {
        <div #messages role="alert" tabindex="-1">
          @if (container.config.httpMessages?.length) {
            <ul data-variant="urgent">
              @for (message of container.config.httpMessages; track message.message) {
                <li>{{ message.type }}: {{ message.message }}</li>
              }
            </ul>
          }
          @for (group of container.getGroupedPageMessages() | keyvalue; track group.key) {
            <ul [attr.data-variant]="group.value.variant">
              @for (message of group.value.messages; track message) {
                <li>{{ message }}</li>
              }
            </ul>
          }
          @if (validationErrors.length) {
            <ul data-variant="urgent">
              @for (message of validationErrors; track message.label) {
                <li>{{ message.label }} {{ message.description }}</li>
              }
            </ul>
          }
        </div>
      }
    }

    @switch (container.renderMode) {
      @case ('confirm') {
        @if (container.hasError) {
          <p>Something went wrong while displaying this page.</p>
        } @else {
          @for (child of container.children; track child.id) {
            <ng-container dxContainer [container]="child" />
          }
        }
      }

      @case ('todo') {
        <section>
          <h2>Assignments</h2>
          @for (item of todoItems; track item.id) {
            <article>
              <h3>{{ item.processName ? item.processName + ' > ' + item.name : item.name }}</h3>
              @if (item.caseName || item.assignee) {
                <p>
                  {{ item.caseName }}
                  @if (item.caseName && item.assignee) { &middot; }
                  @if (item.assignee; as assignee) { Assigned to {{ assignee.name }} }
                </p>
              }
              <button
                type="button"
                [disabled]="loading || !item.canPerform"
                (click)="openTodoItem(item)">
                Go
              </button>
            </article>
          } @empty {
            <p>Thank you for your request. We will contact you as soon as possible.</p>
          }
        </section>
      }

      @case ('form') {
        <form (submit)="$event.preventDefault()">
          @if (container.navigation) {
            <nav aria-label="Steps">
              <ol>
                @for (step of container.navigation.steps; track step.ID) {
                  <li [attr.aria-current]="step.visited_status === 'current' ? 'step' : null">
                    {{ step.name }}
                  </li>
                }
              </ol>
            </nav>
          }
          <fieldset>
            <legend>
              <h2>{{ container.getAssignmentName() }}</h2>
            </legend>
            @if (container.hasError) {
              <p>Something went wrong while displaying this page.</p>
            } @else {
              @for (child of container.children; track child.id) {
                <ng-container dxContainer [container]="child" />
              }
            }
          </fieldset>
          @if (!container.hasError && container.actionButtons) {
            <menu>
              @for (button of container.actionButtons.secondary; track button.actionID) {
                <li>
                  <button type="button" [disabled]="loading" (click)="buttonClick(button)">
                    {{ container.getButtonLabel(button) }}
                  </button>
                </li>
              }
              @for (button of container.actionButtons.main; track button.actionID) {
                <li>
                  <button type="button" [disabled]="loading" (click)="buttonClick(button)">
                    {{ container.getButtonLabel(button) }}
                  </button>
                </li>
              }
            </menu>
          }
        </form>
      }
    }
  `,
  standalone: false
})
export class FlowContainerComponent extends PContainerComponent<FlowContainer> implements OnInit, OnDestroy {
  @ViewChild('messages') private messagesRef?: ElementRef<HTMLElement>;

  public todoItems: TodoItem[] = [];
  public validationErrors: { label: string; description: string }[] = [];
  public loading = false;
  public nextWorkDismissed = false;

  private readonly onUpdate = (): void => this.refresh();

  public get showGetNextWork(): boolean {
    return !this.nextWorkDismissed && this.container.hasGetNextWorkLinks();
  }

  public get hasMessages(): boolean {
    const { httpMessages, pageMessages } = this.container.config;
    return !!httpMessages?.length || !!pageMessages?.length || this.validationErrors.length > 0;
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.refresh();
    this.container.updates.subscribe(this.onUpdate);
  }

  public override ngOnDestroy(): void {
    this.container.updates.unsubscribe(this.onUpdate);
    super.ngOnDestroy();
  }

  public openTodoItem(item: TodoItem): void {
    // Child-case assignments are opened through the case preview, as in Pega's ToDo widget.
    this.runAction(() => this.container.openAssignment(item.assignment, { fromPreview: item.isChild }));
  }

  public buttonClick(button: ActionButton): void {
    this.runAction(() => this.container.buttonClick(button));
  }

  public getNextWork(): void {
    this.runAction(() =>
      this.container.getNextWork().catch((e: { status?: number }[] | Error) => {
        // A 404 means there is no remaining work; anything else is a real error.
        if (!(Array.isArray(e) && e[0]?.status === 404)) {
          throw e;
        }
      })
    );
  }

  private refresh(): void {
    // getTodoItems() registers case-lock handlers as a side effect, so resolve it once
    // per update instead of from the template.
    this.todoItems = this.container.renderMode === 'todo' ? this.container.getTodoItems() : [];
    this.validationErrors = this.container.renderMode === 'form' ? this.container.getValidationErrorMessages() : [];
    // Show the get-next-work notice again when new links arrive after it was dismissed.
    if (!this.container.hasGetNextWorkLinks()) {
      this.nextWorkDismissed = false;
    }
  }

  private async runAction(action: () => Promise<void>): Promise<void> {
    this.loading = true;
    try {
      await action();
    } catch (e) {
      const error = e as { message?: string; type?: string };
      console.error(error?.message || error?.type || 'Error');
    } finally {
      this.loading = false;
      this.refresh();
      // Move focus to the messages after a failed submit, as Pega's Assignment does.
      setTimeout(() => this.messagesRef?.nativeElement.focus());
    }
  }
}
