import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-radio-buttons-control',
  template: `
    <fieldset>
      <legend>
        {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
      </legend>
      @for (option of container.config.datasource; track option.key) {
        <label>
          <input
            type="radio"
            [id]="container.id + '_' + option.key"
            (change)="change($event)"
            [checked]="container.config.value === option.key"
            [name]="container.id"
            [value]="option.key"
          />{{ option.value }}
        </label>
      }
      {{ container.config.helperText }}
      {{ container.config.validatemessage }}
    </fieldset>
  `,
  standalone: false
})
export class RadioButtonsComponent extends PContainerComponent {
  public change(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.container.updateFieldValue(value);
    this.container.triggerFieldChange(value);
  }
}
