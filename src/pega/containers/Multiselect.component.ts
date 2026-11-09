import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { Multiselect } from '@labb/dx-engine';

/**
 * HTML-only mapping of the headless Multiselect container. All search, grouping and selection
 * logic lives in the engine; this template renders its state and forwards user events.
 * The options list is always shown inline (there is no popup), grouped options as nested lists.
 */
@Component({
  selector: 'dx-multi-select',
  template: `
    <div>
    <label [for]="container.id" [hidden]="container.labelHidden">
      {{ container.label }}{{ container.isRequired ? ' *' : '' }}
    </label>
    @if (container.isReadOnly) {
      <p [id]="container.id">{{ selectedText || '---' }}</p>
    } @else {
      @if (container.selectedChips.length) {
        <ul [attr.aria-label]="'Selected ' + container.label">
          @for (chip of container.selectedChips; track chip.id) {
            <li>
              {{ chip.text }}
              <button type="button"
                [attr.aria-label]="'Remove ' + chip.text"
                [disabled]="container.isDisabled"
                (click)="container.toggleItem(chip.id)">×</button>
            </li>
          }
        </ul>
      }
      <input type="text"
        [id]="container.id"
        [attr.aria-label]="container.labelHidden ? container.label : null"
        [value]="container.inputValue"
        [placeholder]="container.placeholder || ''"
        [disabled]="container.isDisabled"
        [attr.aria-invalid]="container.fieldStatus === 'error'"
        [attr.aria-describedby]="container.info ? container.id + '-info' : null"
        (input)="onInput($event)"
        (focus)="container.onFocus()"
        (blur)="container.onBlur()"/>
      <menu>
        <li><button type="button" [disabled]="container.isDisabled" (click)="container.onDropdownButtonClick()">Show options</button></li>
        @if (container.config.isGroupData) {
          <li><button type="button" (click)="container.toggleGroup()">All groups</button></li>
        }
        @if (container.canCreateNew) {
          <li><button type="button" (click)="container.createNew()">Create new</button></li>
        }
      </menu>
      @if (container.isLoading) {
        <p>Loading…</p>
      } @else if (container.items.length) {
        <ul>
          @for (item of container.items; track item.id) {
            <li>
              @if (item.items) {
                <button type="button" (click)="container.toggleGroup(item.id)">{{ item.primary }}</button>
                <ul>
                  @for (child of item.items; track child.id) {
                    <li>
                      <label>
                        <input type="checkbox" [checked]="child.selected" (change)="container.toggleItem(child.id)"/>
                        {{ child.primary }}
                      </label>
                    </li>
                  }
                </ul>
              } @else {
                <label>
                  <input type="checkbox" [checked]="item.selected" (change)="container.toggleItem(item.id)"/>
                  {{ item.primary }}
                  @if (secondaryText(item); as secondary) {
                    <small>{{ secondary }}</small>
                  }
                </label>
              }
            </li>
          }
        </ul>
      } @else if (container.inputValue) {
        <p>{{ container.emptyText }}</p>
      }
    }
    @if (container.info) {
      <small [id]="container.id + '-info'" [attr.role]="container.fieldStatus === 'error' ? 'alert' : null">{{ container.info }}</small>
    }
    </div>
  `,
  standalone: false
})
export class MultiselectComponent extends PContainerComponent<Multiselect> {
  get selectedText(): string {
    return this.container.selectedChips.map(chip => chip.text).join(', ');
  }

  secondaryText(item: { secondary?: string[] }): string {
    return item.secondary?.join(', ') ?? '';
  }

  onInput(event: Event) {
    this.container.onChange((event.target as HTMLInputElement).value);
  }
}
