import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-radio-buttons-control',
  template: `
    <fieldset
      [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
      [attr.aria-describedby]="container.config.validatemessage || container.config.helperText ? container.id + '-info' : null">
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
      @if (container.config.validatemessage) {
        <small role="alert" [id]="container.id + '-info'">{{ container.config.validatemessage }}</small>
      } @else if (container.config.helperText) {
        <small [id]="container.id + '-info'">{{ container.config.helperText }}</small>
      }
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
