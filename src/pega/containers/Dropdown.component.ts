import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-dropdown-control',
  template: `
    @if (container.config.readOnly) {
      <dt>{{ container.config.label }}</dt><dd>{{container.config.value ?? '--'}}</dd>
    } @else {
      <label [for]="container.id">
        {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
        @if (container.config.helperText) {
          <span [attr.data-tooltip]="container.config.helperText">?</span>
        }
      </label>
      @if (container.config.validatemessage) {
        <em>{{ container.config.validatemessage }}</em>
      }
      <select
        [id]="container.id"
        [disabled]="container.config.disabled"
        (change)="change($event)"
      >
        <option disabled [selected]="!container.config.value" value="">
          -- select an option --
        </option>
        @for (option of container.config.datasource; track option.key) {
          <option [value]="option.key" [selected]="container.config.value === option.key">
            {{ option.value }}
          </option>
        }
      </select>
    }
    `,
  standalone: false
})
export class DropdownComponent extends PContainerComponent {
  public change(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.container.updateFieldValue(value);
    this.container.triggerFieldChange(value);
  }
}
