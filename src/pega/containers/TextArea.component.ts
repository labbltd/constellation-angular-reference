import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-text-area-control',
  template: `
  @if (container.config.readOnly) {
    <dl><dt>{{ container.config.label }}</dt><dd [innerHTML]="container.config.value ?? '--'"></dd></dl>
  } @else {
    <div>
      <label [for]="container.id">{{ container.config.label }}{{ container.config.required ? ' *' : '' }}</label>
      <textarea
        [id]="container.id"
        [attr.aria-required]="container.config.required || null"
        [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
        [attr.aria-describedby]="container.config.validatemessage || container.config.helperText ? container.id + '-info' : null"
        [value]="container.config.value"
        (change)="container.updateFieldValue(getValue($event.target))"
        (blur)="container.triggerFieldChange(getValue($event.target))"
      ></textarea>
      @if (container.config.validatemessage) {
        <small role="alert" [id]="container.id + '-info'">{{ container.config.validatemessage }}</small>
      } @else if (container.config.helperText) {
        <small [id]="container.id + '-info'">{{ container.config.helperText }}</small>
      }
    </div>
  }`,
  standalone: false
})
export class TextAreaComponent extends PContainerComponent{
  public getValue(target: EventTarget | null): string {
    return (target as HTMLInputElement).value;
  }
}
