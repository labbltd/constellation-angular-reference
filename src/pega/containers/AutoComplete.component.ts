import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { AutoComplete } from '@labb/dx-engine';

@Component({
  selector: 'dx-auto-complete',
  template: `
    @if (container.config.readOnly) {
      <dl><dt>{{ container.config.label }}</dt><dd>{{container.config.value}}</dd></dl>
    } @else {
      <div>
      <label [for]="container.id">{{ container.config.label }}{{ container.config.required ? ' *' : '' }}</label>
      <select
        [id]="container.id"
        [disabled]="container.config.disabled"
        [attr.aria-required]="container.config.required || null"
        [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
        [attr.aria-describedby]="container.config.validatemessage || container.config.helperText ? container.id + '-info' : null"
        (change)="change($event)"
      >
        <option disabled [selected]="!container.config.value" value="">
          -- select an option --
        </option>
        @for (option of items; track option.key) {
          <option [value]="option.key" [selected]="container.config.value === option.key">
            {{ option.value }}
          </option>
        }
      </select>
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
export class DxAutocompleteComponent extends PContainerComponent<AutoComplete> {
  public items: { key: string, value: string }[] = [];
  public value: string = '';

  override ngOnInit(): void {
    super.ngOnInit();
    this.value = this.container.config.value;
  }

  public change(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.container.updateFieldValue(value);
    this.container.triggerFieldChange(value);
  }

  public matches(item: string, search: string) {
    const normalizedItem = item.trim().toLowerCase();
    const normalizedSearch = search.trim().toLowerCase();
    return normalizedSearch.split('').reduce((idx, letter) =>
      idx === -1 ? idx : normalizedItem.split('').indexOf(letter, idx == -2 ? 0 : idx + 1),
      -2
    ) >= 0;
  }
}