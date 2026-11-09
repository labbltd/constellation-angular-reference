import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { ListView } from '@labb/dx-engine';

/**
 * HTML-only mapping of the ListView container.
 *
 * `container.updatedRefList` holds one live, display-only cell container per column for each row,
 * rendered through `dxContainer`. Selection and link actions take the raw response row
 * (`container.response`, aligned by index), because they need the unformatted values.
 */
@Component({
  selector: 'dx-list-view-container',
  template: `
    @if (container.showRecords) {
      <figure>
      <table [id]="container.id" [attr.aria-describedby]="container.config.validatemessage ? container.id + '-error' : null">
        <caption>
          {{ container.label }}{{ container.config.required ? ' *' : '' }}
          @if (container.config.helperText) {
            <br><small>{{ container.config.helperText }}</small>
          }
        </caption>
        <thead>
          <tr>
            @if (isSelectable) {
              <th scope="col">Select</th>
            }
            @for (col of container.fields; track col.config.name) {
              <th scope="col">{{ col.config.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of container.updatedRefList; track row.id; let rowIndex = $index) {
            <tr>
              @if (container.singleSelectionMode) {
                <td>
                  <input type="radio"
                    [name]="container.id"
                    [attr.aria-label]="'Select row ' + (rowIndex + 1)"
                    [checked]="container.isRowSelected(rawRow(rowIndex))"
                    (change)="container.selectRow(rawRow(rowIndex))"/>
                </td>
              }
              @if (container.multiSelectionMode) {
                <td>
                  <input type="checkbox"
                    [name]="container.id"
                    [attr.aria-label]="'Select row ' + (rowIndex + 1)"
                    [checked]="container.isRowSelected(rawRow(rowIndex))"
                    (change)="selectRow(rowIndex, $event)"/>
                </td>
              }
              @for (col of container.fields; track col.config.name) {
                <td>
                  @if (isLink(col, rowIndex)) {
                    <a href="#" (click)="openLink($event, col, rowIndex)">
                      <ng-container dxContainer [container]="row[col.config.name]"/>
                    </a>
                  } @else {
                    <ng-container dxContainer [container]="row[col.config.name]"/>
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="container.fields.length + (isSelectable ? 1 : 0) || 1">No records</td>
            </tr>
          }
        </tbody>
      </table>
      @if (container.config.validatemessage) {
        <small role="alert" [id]="container.id + '-error'">{{ container.config.validatemessage }}</small>
      }
      </figure>
    }
  `,
  standalone: false
})
export class ListViewComponent extends PContainerComponent<ListView> {
  get isSelectable(): boolean {
    return this.container.singleSelectionMode || this.container.multiSelectionMode;
  }

  /** The unformatted response row behind the rendered row at the given index. */
  rawRow(index: number): any {
    return this.container.response[index];
  }

  isLink(col: any, index: number): boolean {
    return !!col.config.displayAsLink || this.container.showButton(col.config.name, this.rawRow(index));
  }

  openLink(event: Event, col: any, index: number) {
    event.preventDefault();
    this.container.listViewClick(col.config, this.rawRow(index));
  }

  selectRow(index: number, event: Event) {
    this.container.selectRow(this.rawRow(index), (event.target as HTMLInputElement).checked);
  }
}
