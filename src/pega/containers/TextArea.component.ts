import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-text-area-control',
  template: `
  @if (container.config.readOnly) {
    <dt>{{ container.config.label }}</dt><dd [innerHTML]="container.config.value ?? '--'"></dd>
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
    <textarea
      [id]="container.id"
      [value]="container.config.value"
      (change)="container.updateFieldValue(getValue($event.target))"
      (blur)="container.triggerFieldChange(getValue($event.target))"
    ></textarea>
  }`,
  standalone: false
})
export class TextAreaComponent extends PContainerComponent{
  public getValue(target: EventTarget | null): string {
    return (target as HTMLInputElement).value;
  }
}
