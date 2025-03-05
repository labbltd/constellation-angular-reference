import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-radio-buttons-control',
  template: `
    <fieldset>
      <legend>
        {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
      </legend>
      <ng-container *ngFor="let option of container.config.datasource">
        <label>
          <input
            type="radio"
            (change)="container.updateFieldValue(getValue($event.target))"
            (blur)="container.triggerFieldChange(getValue($event.target))"
            [checked]="container.config.value === option.key"
            [name]="container.id"
            [value]="option.key"
          />{{ option.value }}
        </label>
      </ng-container>
      {{ container.config.helperText }}
      {{ container.config.validatemessages }}
    </fieldset>
  `,
})
export class RadioButtonsComponent extends PContainerComponent {
  public getValue(target: EventTarget | null): string {
    return (target as HTMLInputElement).value;
  }
}
