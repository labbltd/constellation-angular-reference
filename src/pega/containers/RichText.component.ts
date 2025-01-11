import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PContainerComponent } from '@typescale/angular-adapter';

@Component({
  selector: 'dx-rich-text-area-control',
  template: `<label
    >{{ container.config.label }}{{ container.config.required ? ' *' : '' }}
    <textarea
      [formControl]="control"
      (change)="container.updateFieldValue(getValue($event.target))"
      (blur)="container.triggerFieldChange(getValue($event.target))"
    ></textarea>
    {{ container.config.helperText }}
    {{ container.config.validatemessage }}
  </label> `,
})
export class RichTextComponent extends PContainerComponent implements OnInit {
  public control = new FormControl('');

  public ngOnInit(): void {
    this.control.setValue(this.container.config.value);
  }

  public get type(): string {
    return this.container.config.fieldMetadata?.type === 'Decimal'
      ? 'number'
      : 'text';
  }

  public getValue(target: EventTarget | null): string | number {
    return this.type === 'number'
      ? (target as HTMLInputElement).valueAsNumber
      : (target as HTMLInputElement).value;
  }
}
