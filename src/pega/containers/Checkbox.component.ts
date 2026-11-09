import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-text-input-control',
  template: `
    @if(container.config.readOnly) {
        <dl><dt>{{container.config.caption}}</dt><dd>{{container.config.value ? container.config.trueLabel : container.config.falseLabel}}</dd></dl>
    } @else {
      <div>
        <label [for]="container.id">
          <input
            [id]="container.id"
            type="checkbox"
            [attr.aria-required]="container.config.required || null"
        [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
        [attr.aria-describedby]="container.config.validatemessage || container.config.helperText ? container.id + '-info' : null"
            [disabled]="container.config.disabled"
            [checked]="container.config.value"
            (change)="change($event)"
          />
          {{ container.config.caption }}{{ container.config.required ? ' *' : '' }}
        </label>
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
export class CheckboxComponent extends PContainerComponent {
  public change(event: Event) {
    if (!event.target) return;
    const val = (event.target as HTMLInputElement).checked;
    this.container.updateFieldValue(val);
    this.container.triggerFieldChange(val);
  }
}
