import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-rich-text-control',
  template: `<label
    >{{ container.config.label }}{{ container.config.required ? ' *' : '' }}
    <textarea
      [value]="container.config.value"
      (change)="container.updateFieldValue(getValue($event.target))"
      (blur)="container.triggerFieldChange(getValue($event.target))"
    ></textarea>
    {{ container.config.helperText }}
    {{ container.config.validatemessage }}
  </label>`,
  standalone: false
})
export class RichTextComponent extends PContainerComponent {

  public getValue(target: EventTarget | null): string | number {
    return (target as HTMLTextAreaElement).value;
  }
}
