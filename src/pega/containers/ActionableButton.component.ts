import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-actionable-button-container',
  template: `
    <div>
      <button type="button" (click)="performAction()">{{container.config.label}}</button>
    </div>
  `,
})
export class ActionableButtonComponent extends PContainerComponent {
  public performAction() {
    this.container.pconnect
      .getActionsApi()
      .openLocalAction(this.container.config.localAction, {
        caseID: this.container.config.value,
        containerName: 'modal',
        type: 'express'
      });
  }
}
