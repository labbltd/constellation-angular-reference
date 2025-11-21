import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ActionButton } from '@labb/constellation-core-types';
import { ModalViewContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-modal-view-container',
  template: `
    <dialog #dialog>
      <h3>{{container.heading}}</h3>
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
    </dialog>
  `,
  standalone: false
})
export class ModalViewContainerComponent extends PContainerComponent<ModalViewContainer> implements OnInit {
  @ViewChild('dialog') public dialog!: ElementRef;
  public loading = false;
  public errorMessage?: string;

  public override ngOnInit(): void {
    super.ngOnInit();
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
