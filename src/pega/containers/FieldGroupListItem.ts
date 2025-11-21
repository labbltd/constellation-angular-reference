import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { FieldGroupListItemProps, PContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-field-group-list-item',
  template: `
    @if (container.config.allowDelete) {
      <button type="button"
        style="height: 100%"
        (click)="container.config.deleteFieldGroupItem()">
        x
      </button>
    }
    @if (container.config.label) {
      <strong>{{container.config.label}}</strong>
    }
    @for(child of container.children; track child.id) {
      <ng-container dxContainer [container]="child"></ng-container>
    }
  `,
  standalone: false
})
export class DxFieldGroupListItem extends PContainerComponent<PContainer<FieldGroupListItemProps>> {
}
