import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { View } from '@labb/dx-engine';

@Component({
  selector: 'dx-view-container',
  template: `
    <div [ngClass]="{group: container.pconnect.getComponentName().startsWith('Group'), readOnly: container.config.readOnly}">
      @for (message of container.config.httpMessages; track message.message) {
        <div>
          {{message.type}}: {{message.message}}
        </div>
      }
      @if (container.config.showHeading) { <h2>{{container.config.heading}}</h2> }
      @if (container.config.showLabel) { <span>{{container.config.label}}</span> }
      @if (container.config.instructions && !['none', 'casestep'].includes(container.config.instructions)) { <div [innerHtml]="container.config.instructions"></div> }
      <div class="body">
        @for (child of container.children; track child.id) {
            <ng-container dxContainer [container]="child"/>
        }
      </div>
    </div>
  `,
  standalone: false
})
export class ViewComponent extends PContainerComponent<View> {
}
