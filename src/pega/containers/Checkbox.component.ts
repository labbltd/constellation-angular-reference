import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-text-input-control',
  template: `
    @if(container.config.readOnly) {
        <dt>{{container.config.caption}}</dt><dd>{{container.config.value ? container.config.trueLabel : container.config.falseLabel}}</dd>
    } @else {
      <div>
        <label [for]="container.id">
        <input
          [id]="container.id"
          type="checkbox"
          [disabled]="container.config.disabled"
          [checked]="container.config.value"
          (change)="change($event)"
        />
        {{ container.config.caption }}{{ container.config.required ? ' *' : '' }}
        </label>
        {{ container.config.helperText }}
        {{ container.config.validatemessage }}
      </div>
    }
   `,
  standalone: false
})
export class CheckboxComponent extends PContainerComponent {
  public change(event: Event) {
    if (!event.target) return;
    const val = (event.target as HTMLInputElement).checked;
    this.container.updateFieldValue(val);
    this.container.triggerFieldChange(val);
  }
}
