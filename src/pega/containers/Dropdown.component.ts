import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PContainerComponent } from '@labb/angular-adapter';
import { Dropdown } from '@labb/dx-engine';

@Component({
  selector: 'dx-dropdown-control',
  template: `
  <label>
    {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
    <select
      [id]="container.id"
      [value]="container.config.value"
      (change)="change($event)"
    >
      <option disabled selected value="">
        -- select an option --
      </option>
      @for (option of container.listItems; track option.key) {
        <option [value]="option.key">
          {{ option.value }}
        </option>
      }
    </select>
    {{ container.config.helperText }}
    {{ container.config.validatemessage }}
  </label> `,
  standalone: false
})
export class DropdownComponent extends PContainerComponent<Dropdown> implements OnInit {
  public change(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.container.updateFieldValue(value);
    this.container.triggerFieldChange(value);
  }
}
