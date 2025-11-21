import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ActionButton } from '@labb/constellation-core-types';
import { ModalViewContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-modal-view-container',
  template: `
    <dialog #dialog>
      <h3>{{container.heading}}</h3>
      @for (child of container.children; track child.id) {
        <ng-container dxContainer [container]="child"/>
      }
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
    </dialog>
  `,
  standalone: false
})
export class ModalViewContainerComponent extends PContainerComponent<ModalViewContainer> implements OnInit, OnDestroy {
  @ViewChild('dialog') public dialog!: ElementRef;
  public loading = false;
  public errorMessage?: string;

  public override ngOnInit(): void {
    super.ngOnInit();
    const {
      PUB_SUB_EVENTS: { EVENT_SHOW_CANCEL_ALERT }
    } = window.PCore.getConstants();
    const { subscribe } = window.PCore.getPubSubUtils();
    subscribe(EVENT_SHOW_CANCEL_ALERT, (payload: any) => {
      if (window.confirm('You will lose information. Confirm to continue.')) {
        this.container.children[0].pconnect.getActionsApi().cancelAssignment(this.container.pconnect.getContextName());
      }
    }, EVENT_SHOW_CANCEL_ALERT);

    this.container.updates.subscribe(() => {
      if (this.container.hasContainerItems()) {
        if (!this.dialog.nativeElement.open) {
          this.dialog.nativeElement.showModal();
        }
      } else {
        if (this.dialog.nativeElement.open) {
          this.dialog.nativeElement.close();
        }
      }
    })
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();

    const {
      PUB_SUB_EVENTS: { EVENT_SHOW_CANCEL_ALERT }
    } = window.PCore.getConstants();
    const { unsubscribe } = window.PCore.getPubSubUtils();
    unsubscribe(EVENT_SHOW_CANCEL_ALERT, EVENT_SHOW_CANCEL_ALERT);
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
