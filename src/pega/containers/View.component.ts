import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { View } from '@labb/dx-engine';

@Component({
  selector: 'dx-view-container',
  template: `
    <ng-template #body>
      @for (message of container.config.httpMessages; track message.message) {
        <p role="alert">{{message.type}}: {{message.message}}</p>
      }
      @if (hasInstructions) { <div role="note" [innerHtml]="container.config.instructions"></div> }
      @for (child of container.children; track child.id) {
        <ng-container dxContainer [container]="child"/>
      }
    </ng-template>

    @if (isGroup && container.config.showLabel) {
      <fieldset>
        <legend>{{container.config.label}}</legend>
        <ng-container *ngTemplateOutlet="body"/>
      </fieldset>
    } @else if (container.config.showHeading || container.config.showLabel) {
      <section>
        <h3>{{container.config.showHeading ? container.config.heading : container.config.label}}</h3>
        <ng-container *ngTemplateOutlet="body"/>
      </section>
    } @else {
      <div>
        <ng-container *ngTemplateOutlet="body"/>
      </div>
    }
  `,
  standalone: false
})
export class ViewComponent extends PContainerComponent<View> {
  /** Group views render as a fieldset: a set of related fields with a caption. */
  get isGroup(): boolean {
    return this.container.pconnect.getComponentName().startsWith('Group');
  }

  get hasInstructions(): boolean {
    const { instructions } = this.container.config;
    return !!instructions && !['none', 'casestep'].includes(instructions);
  }
}
