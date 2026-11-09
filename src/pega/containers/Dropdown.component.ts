import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-dropdown-control',
  template: `
    @if (container.config.readOnly) {
      <dl><dt>{{ container.config.label }}</dt><dd>{{container.config.value ?? '--'}}</dd></dl>
    } @else {
      <div>
      <label [for]="container.id">{{ container.config.label }}{{ container.config.required ? ' *' : '' }}</label>
      <select
        [id]="container.id"
        [disabled]="container.config.disabled"
        [attr.aria-required]="container.config.required || null"
        [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
        [attr.aria-describedby]="container.config.validatemessage || container.config.helperText ? container.id + '-info' : null"
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
      @if (container.config.validatemessage) {
        <small role="alert" [id]="container.id + '-info'">{{ container.config.validatemessage }}</small>
      } @else if (container.config.helperText) {
        <small [id]="container.id + '-info'">{{ container.config.helperText }}</small>
      }
      </div>
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
