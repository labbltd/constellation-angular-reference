import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-text-input-control',
  template: `
    <div>
      <label [for]="container.id">
        {{container.config.label}}
        <input
          [id]="container.id"
          [checked]="container.config.value"
          type="checkbox"
          [attr.disabled]="container.config.disabled"
          (change)="change($event)"
        />
        {{ container.config.caption }}{{ container.config.required ? ' *' : '' }}
      </label>
      {{ container.config.helperText }}
      {{ container.config.validatemessage }}
    </div>
   `,
  standalone: false
})
export class CheckboxComponent extends PContainerComponent {
  public change(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.container.updateFieldValue(value);
    this.container.triggerFieldChange(value);
  }
}
