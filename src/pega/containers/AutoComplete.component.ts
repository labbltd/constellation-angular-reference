import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { Dropdown } from '@labb/dx-engine';

@Component({
  selector: 'dx-auto-complete',
  template: `
    @if (container.config.readOnly) {
      <dt>{{ container.config.label }}</dt><dd>{{container.config.value}}</dd>
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
      <select
        [id]="container.id"
        [disabled]="container.config.disabled"
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
    }
`,
  standalone: false
})
export class DxAutocompleteComponent extends PContainerComponent<Dropdown> {
  public items: { key: string, value: string }[] = [];
  public value: string = '';

  override ngOnInit(): void {
    super.ngOnInit();
    this.value = this.container.config.value;
    this.setOptions();
  }

  public change(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.container.updateFieldValue(value);
    this.container.triggerFieldChange(value);
  }

  public async setOptions() {
    if (this.items.length === 0) {
      const name = (this.container.config.fieldMetadata as any)?.datasource?.name || this.container.config.datasource;
      if (name) {
        const parameters = (this.container.config.fieldMetadata as any)?.datasource?.parameters || [];
        const dataPageParams = parameters.reduce((acc: any, param: any) => ({
          ...acc,
          [param.name]: param.value
        }), {} as { [key: string]: string });
        const response = await window.PCore.getDataApiUtils().getData<{ pyLocalizedValue: string, pyFieldValue: string }>(name, { dataViewParameters: dataPageParams });
        if (response.data?.data) {
          const cols = this.container.config.columns;
          if (cols) {
            const items = response.data.data.map((item: { [key: string]: string }) => ({
              value: item[cols.find(col => col.display === 'true').value.replace('\.', '')],
              key: item[cols.find(col => col.key === 'true').value.replace('\.', '')]
            }))
            this.items = items;;
          } else {
            const items = response.data.data.map(item => ({
              value: item.pyLocalizedValue,
              key: item.pyFieldValue
            }))
            this.items = items;;
          }
          const matchedItem = this.items.find(item => item.value === this.value)?.value;
          if (matchedItem) {
            this.value = matchedItem;
          }
        }
      }
    }
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