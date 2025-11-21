import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { SimpleTable } from '@labb/dx-engine';

@Component({
  selector: 'dx-simple-table',
  template: `
    @for(child of container.children; track child.id) {
      <ng-container dxContainer [container]="child"></ng-container>
    }
    @if(container.config.validatemessage) {
      <em>{{container.config.validatemessage}}</em>
    }
    @if(container.config.multiRecordDisplayAs === 'fieldGroup'){
      <button type="button"
        (click)="container.addFieldGroupItem()">
        Add {{container.config.targetClassLabel}}
      </button>
    }
    `,
  standalone: false
})
export class DxSimpleTable extends PContainerComponent<SimpleTable> {
}
