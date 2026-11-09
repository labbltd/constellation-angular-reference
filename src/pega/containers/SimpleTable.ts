import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { SimpleTable } from '@labb/dx-engine';

@Component({
  selector: 'dx-simple-table',
  template: `
    <section>
      @for(child of container.children; track child.id) {
        <ng-container dxContainer [container]="child"></ng-container>
      }
      @if(container.config.validatemessage) {
        <p><small role="alert">{{container.config.validatemessage}}</small></p>
      }
      @if(container.config.multiRecordDisplayAs === 'fieldGroup'){
        <menu>
          <li>
            <button type="button" (click)="container.addFieldGroupItem()">
              + Add {{container.config.targetClassLabel}}
            </button>
          </li>
        </menu>
      }
    </section>
    `,
  standalone: false
})
export class DxSimpleTable extends PContainerComponent<SimpleTable> {
}
