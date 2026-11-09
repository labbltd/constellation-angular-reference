import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { FieldGroupListItemProps, PContainer } from '@labb/dx-engine';

@Component({
  selector: 'dx-field-group-list-item',
  template: `
    <fieldset>
      @if (container.config.label) {
        <legend>{{container.config.label}}</legend>
      }
      @for(child of container.children; track child.id) {
        <ng-container dxContainer [container]="child"></ng-container>
      }
      @if (container.config.allowDelete) {
        <menu>
          <li>
            <button type="button"
              [attr.aria-label]="'Delete ' + (container.config.label || 'item')"
              (click)="container.config.deleteFieldGroupItem()">
              Delete
            </button>
          </li>
        </menu>
      }
    </fieldset>
  `,
  standalone: false
})
export class DxFieldGroupListItem extends PContainerComponent<PContainer<FieldGroupListItemProps>> {
}
