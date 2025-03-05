import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ActionButton } from '@labb/constellation-core-types';
import { ModalViewContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-modal-view-container',
  template: `
    <dialog #dialog>
      <h3>{{container.heading}}</h3>
      <ng-container *ngIf="container.children.length > 0"
        dxContainer
        [container]="container.children[0]"
      ></ng-container>
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
    </dialog>
  `,
})
export class ModalViewContainerComponent extends PContainerComponent<ModalViewContainer> implements OnInit {
  @ViewChild('dialog') public dialog!: ElementRef;
  public loading = false;
  public errorMessage?: string;

  public ngOnInit(): void {
    this.container.updates.subscribe(() => {
      if (this.container.hasContainerItems()) {
        this.dialog.nativeElement.showModal();
      } else {
        this.dialog.nativeElement.close();
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
